import { prisma } from '@/lib/db'
import { buildReportData } from './build'
import { analyzeReport } from '@/lib/ai/analyze'
import { syncIntegration } from '@/lib/integrations'
import { randomToken } from '@/lib/crypto'
import type { Prisma } from '@prisma/client'

/**
 * Gera (ou regenera) um relatório:
 * 1. sincroniza as integrações do cliente no período;
 * 2. agrega as métricas em um snapshot imutável;
 * 3. opcionalmente roda a análise de IA;
 * 4. persiste tudo e marca o relatório como READY.
 */
export async function generateReport(reportId: string, opts: { includeAi?: boolean } = {}) {
  const report = await prisma.report.findUniqueOrThrow({ where: { id: reportId } })
  await prisma.report.update({ where: { id: reportId }, data: { status: 'GENERATING' } })

  try {
    const start = report.startDate
    const end = report.endDate
    const startStr = start.toISOString().slice(0, 10)
    const endStr = end.toISOString().slice(0, 10)

    // 1. Sincroniza dados das integrações do cliente
    const integrations = await prisma.integration.findMany({
      where: { clientId: report.clientId, status: 'CONNECTED' },
    })
    for (const integration of integrations) {
      try {
        await syncIntegration(integration, startStr, endStr)
      } catch (err) {
        console.error(`Sync falhou (${integration.platform}):`, err)
        await prisma.integration.update({ where: { id: integration.id }, data: { status: 'ERROR' } })
      }
    }

    // 2. Agrega
    const data = await buildReportData(report.clientId, start, end)

    // 3. IA (opcional)
    if (opts.includeAi !== false) {
      const insights = await analyzeReport(data)
      await prisma.aiInsight.deleteMany({ where: { reportId } })
      await prisma.aiInsight.createMany({
        data: [
          { reportId, type: 'EXECUTIVE_SUMMARY', content: insights.executiveSummary },
          { reportId, type: 'PERFORMANCE_ANALYSIS', content: insights.performanceAnalysis },
          { reportId, type: 'GROWTH_EXPLANATION', content: insights.growthExplanation },
          { reportId, type: 'OPTIMIZATION', content: insights.optimizations.join('\n') },
        ],
      })
    }

    // 4. Persiste snapshot + token de compartilhamento
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'READY',
        generatedAt: new Date(),
        dataSnapshot: data as unknown as Prisma.InputJsonValue,
        shareToken: report.shareToken ?? randomToken(18),
      },
    })

    return updated
  } catch (err) {
    await prisma.report.update({ where: { id: reportId }, data: { status: 'ERROR' } })
    throw err
  }
}
