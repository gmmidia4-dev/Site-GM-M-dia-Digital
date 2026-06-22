import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireStaff, assertClientAccess } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'
import { generateReport } from '@/lib/reports/generate'

/** Regenera um relatório existente (re-sincroniza e recalcula). */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    const report = await prisma.report.findUnique({ where: { id: params.id } })
    if (!report) return ok({ error: 'Relatório não encontrado' }, 404)
    await assertClientAccess(user, report.clientId)

    const body = await req.json().catch(() => ({}))
    const generated = await generateReport(params.id, { includeAi: body.includeAi !== false })
    return ok(generated)
  } catch (err) {
    return handleError(err)
  }
}
