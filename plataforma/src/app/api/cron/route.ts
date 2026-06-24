import { NextRequest } from 'next/server'
import { runDue } from '@/lib/reports/cron'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Cron diário unificado: dispara as frequências devidas conforme a data. */
export async function GET(req: NextRequest) {
  return runDue(req)
}
