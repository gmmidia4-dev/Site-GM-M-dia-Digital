import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireStaff } from '@/lib/rbac'
import { AuthError } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    const integration = await prisma.integration.findUnique({ where: { id: params.id } })
    if (!integration || integration.agencyId !== user.agencyId) {
      throw new AuthError('Integração não encontrada', 404)
    }
    await prisma.integration.delete({ where: { id: params.id } })
    return ok({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
