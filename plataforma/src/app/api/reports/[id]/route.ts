import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireUser, requireStaff, assertClientAccess } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser()
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: { insights: true, client: true, deliveries: true },
    })
    if (!report) return ok({ error: 'Relatório não encontrado' }, 404)
    await assertClientAccess(user, report.clientId)
    return ok(report)
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    const report = await prisma.report.findUnique({ where: { id: params.id } })
    if (!report) return ok({ error: 'Relatório não encontrado' }, 404)
    await assertClientAccess(user, report.clientId)
    await prisma.report.delete({ where: { id: params.id } })
    return ok({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
