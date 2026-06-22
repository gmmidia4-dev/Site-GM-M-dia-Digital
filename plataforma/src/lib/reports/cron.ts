import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReport } from './generate'
import { deliverReport } from './deliver'
import type { ScheduleFrequency } from '@prisma/client'

/** Valida o segredo do cron (Vercel envia Authorization: Bearer $CRON_SECRET). */
function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'
  const header = req.headers.get('authorization')
  return header === `Bearer ${secret}`
}

function periodFor(freq: ScheduleFrequency): { start: Date; end: Date; title: string } {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() - 1) // até ontem
  const start = new Date(end)
  if (freq === 'DAILY') {
    start.setUTCDate(end.getUTCDate())
  } else if (freq === 'WEEKLY') {
    start.setUTCDate(end.getUTCDate() - 6)
  } else {
    start.setUTCDate(end.getUTCDate() - 29)
  }
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR')
  return { start, end, title: `Relatório ${freq === 'DAILY' ? 'diário' : freq === 'WEEKLY' ? 'semanal' : 'mensal'} (${fmt(start)} – ${fmt(end)})` }
}

/**
 * Executa todos os agendamentos de uma frequência: cria o relatório do período,
 * gera (com IA) e entrega pelos canais configurados.
 */
export async function runScheduled(req: NextRequest, freq: ScheduleFrequency) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const schedules = await prisma.reportSchedule.findMany({
    where: { frequency: freq, isActive: true },
    include: { client: true },
  })

  const { start, end, title } = periodFor(freq)
  const results: { scheduleId: string; reportId?: string; ok: boolean; error?: string }[] = []

  for (const schedule of schedules) {
    try {
      const report = await prisma.report.create({
        data: {
          agencyId: schedule.agencyId,
          clientId: schedule.clientId,
          title: `${schedule.client.name} — ${title}`,
          period: freq,
          startDate: start,
          endDate: end,
          status: 'DRAFT',
        },
      })
      await generateReport(report.id, { includeAi: schedule.includeAi })
      await deliverReport(report.id, schedule.channels, schedule.recipients)
      await prisma.reportSchedule.update({
        where: { id: schedule.id },
        data: { lastRunAt: new Date() },
      })
      results.push({ scheduleId: schedule.id, reportId: report.id, ok: true })
    } catch (err: any) {
      results.push({ scheduleId: schedule.id, ok: false, error: String(err?.message ?? err) })
    }
  }

  return NextResponse.json({ frequency: freq, processed: results.length, results })
}
