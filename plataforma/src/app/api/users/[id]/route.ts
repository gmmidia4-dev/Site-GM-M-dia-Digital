import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireRole, AuthError } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole('ADMIN')
    if (params.id === admin.id) {
      return ok({ error: 'Você não pode remover a si mesmo.' }, 400)
    }
    const target = await prisma.user.findUnique({ where: { id: params.id } })
    if (!target || target.agencyId !== admin.agencyId) {
      throw new AuthError('Usuário não encontrado', 404)
    }
    await prisma.user.delete({ where: { id: params.id } })
    return ok({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
