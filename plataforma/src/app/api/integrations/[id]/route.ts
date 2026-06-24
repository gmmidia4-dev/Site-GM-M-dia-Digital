import { NextRequest } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { requireStaff, AuthError } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

const patchSchema = z.object({
  externalAccountId: z.string().min(1),
  accountName: z.string().optional(),
})

async function ownIntegration(id: string, agencyId: string) {
  const integration = await prisma.integration.findUnique({ where: { id } })
  if (!integration || integration.agencyId !== agencyId) {
    throw new AuthError('Integração não encontrada', 404)
  }
  return integration
}

/** Define a conta de anúncios escolhida após o OAuth. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    await ownIntegration(params.id, user.agencyId)
    const data = patchSchema.parse(await req.json())

    try {
      const updated = await prisma.integration.update({
        where: { id: params.id },
        data: {
          externalAccountId: data.externalAccountId,
          accountName: data.accountName,
          status: 'CONNECTED',
        },
      })
      const { accessToken, refreshToken, ...safe } = updated
      return ok(safe)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return ok({ error: 'Esta conta já está conectada nesta agência.' }, 409)
      }
      throw err
    }
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    await ownIntegration(params.id, user.agencyId)
    await prisma.integration.delete({ where: { id: params.id } })
    return ok({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
