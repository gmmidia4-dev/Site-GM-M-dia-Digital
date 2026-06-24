import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReport } from './generate'
import { deliverReport } from './deliver'
import { computeNextRun } from './schedule'
import type { ScheduleFrequency } from '@prisma/client'

/** Valida o segredo do cron (Vercel envia Authorization: Bearer $CRON_SECRET). */
export function authorizeCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== 'production'
  return req.headers.get('authorization') === `Bearer ${secret}`
}

function periodFor(freq: ScheduleFrequency): { start: Date; end: Date; title: string } {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() - 1) // até ontem
  const start = new Date(end)
  if (freq === 'WEEKLY') start.setUTCDate(end.getUTCDate() - 6)
  else if (freq === 'MONTHLY') start.setUTCDate(end.getUTCDate() - 29)
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR')
  const label = freq === 'DAILY' ? 'diário' : freq === 'WEEKLY' ? 'semanal' : 'mensal'
  return { start, end, title: `Relatório ${label} (${fmt(start)} – ${fmt(end)})` }
}

/** Processa todos os agendamentos ativos de uma frequência. */
export async function processFrequency(freq: ScheduleFrequency) {
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
        data: { lastRunAt: new Date(), nextRunAt: computeNextRun(freq) },
      })
      results.push({ scheduleId: schedule.id, reportId: report.id, ok: true })
    } catch (err: any) {
      results.push({ scheduleId: schedule.id, ok: false, error: String(err?.message ?? err) })
    }
  }
  return results
}

/** Endpoint de frequência única (chamado pelas rotas /api/cron/{daily,weekly,monthly}). */
export async function runScheduled(req: NextRequest, freq: ScheduleFrequency) {
  if (!authorizeCron(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const results = await processFrequency(freq)
  return NextResponse.json({ frequency: freq, processed: results.length, results })
}

/**
 * Endpoint diário unificado (compatível com o plano Hobby da Vercel: 1 cron).
 * Sempre roda DAILY; roda WEEKLY às segundas; roda MONTHLY no dia 1º.
 */
export async function runDue(req: NextRequest) {
  if (!authorizeCron(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const today = new Date()
  const freqs: ScheduleFrequency[] = ['DAILY']
  if (today.getUTCDay() === 1) freqs.push('WEEKLY')
  if (today.getUTCDate() === 1) freqs.push('MONTHLY')

  const out: Record<string, unknown> = {}
  for (const freq of freqs) out[freq] = await processFrequency(freq)
  return NextResponse.json({ ran: freqs, results: out })
}
