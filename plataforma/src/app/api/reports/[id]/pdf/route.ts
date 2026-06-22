import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireUser, assertClientAccess } from '@/lib/rbac'
import { handleError } from '@/lib/api'
import { renderReportPdf } from '@/lib/pdf/render'
import { buildReportData } from '@/lib/reports/build'
import type { ReportData } from '@/lib/types'
import type { ReportInsights } from '@/lib/ai/analyze'

export const runtime = 'nodejs'

/** Gera/stream do PDF do relatório. */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser()
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: { insights: true },
    })
    if (!report) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    await assertClientAccess(user, report.clientId)

    const data: ReportData = (report.dataSnapshot as unknown as ReportData) ??
      (await buildReportData(report.clientId, report.startDate, report.endDate))

    const insights = insightsFromRecords(report.insights)
    const pdf = await renderReportPdf(data, insights)

    return new NextResponse(pdf as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="relatorio-${params.id}.pdf"`,
      },
    })
  } catch (err) {
    return handleError(err)
  }
}

function insightsFromRecords(records: { type: string; content: string }[]): ReportInsights | undefined {
  if (records.length === 0) return undefined
  const get = (t: string) => records.find((r) => r.type === t)?.content ?? ''
  return {
    executiveSummary: get('EXECUTIVE_SUMMARY'),
    performanceAnalysis: get('PERFORMANCE_ANALYSIS'),
    growthExplanation: get('GROWTH_EXPLANATION'),
    optimizations: get('OPTIMIZATION').split('\n').filter(Boolean),
  }
}
