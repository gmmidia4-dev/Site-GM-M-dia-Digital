import type { ScheduleFrequency } from '@prisma/client'

/** Próxima execução às 09:00 UTC conforme a frequência. */
export function computeNextRun(frequency: ScheduleFrequency, from = new Date()): Date {
  const next = new Date(from)
  next.setUTCHours(9, 0, 0, 0)

  if (frequency === 'DAILY') {
    if (next <= from) next.setUTCDate(next.getUTCDate() + 1)
  } else if (frequency === 'WEEKLY') {
    // próxima segunda-feira
    const day = next.getUTCDay() // 0=dom … 1=seg
    let add = (1 - day + 7) % 7
    if (add === 0 && next <= from) add = 7
    next.setUTCDate(next.getUTCDate() + add)
  } else {
    // primeiro dia do próximo mês
    next.setUTCDate(1)
    next.setUTCMonth(next.getUTCMonth() + 1)
  }
  return next
}
