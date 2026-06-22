import { NextRequest } from 'next/server'
import { runScheduled } from '@/lib/reports/cron'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  return runScheduled(req, 'DAILY')
}
