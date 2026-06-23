import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/** Health check: confirma app + conexão com o banco. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', db: 'up', time: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: 'degraded', db: 'down' }, { status: 503 })
  }
}
