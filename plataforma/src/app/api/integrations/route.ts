import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { integrationSchema } from '@/lib/validations'
import { requireStaff, assertClientAccess } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

export async function GET() {
  try {
    const user = await requireStaff()
    const integrations = await prisma.integration.findMany({
      where: { agencyId: user.agencyId },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    // nunca expõe tokens
    const safe = integrations.map(({ accessToken, refreshToken, ...rest }) => rest)
    return ok(safe)
  } catch (err) {
    return handleError(err)
  }
}

/**
 * Conecta (ou registra) uma conta de anúncios a um cliente.
 * Em modo demo, basta o ID externo — o fluxo OAuth completo é feito via
 * /api/integrations/:platform/authorize + callback.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireStaff()
    const data = integrationSchema.parse(await req.json())
    await assertClientAccess(user, data.clientId)

    const integration = await prisma.integration.upsert({
      where: {
        agencyId_platform_externalAccountId: {
          agencyId: user.agencyId,
          platform: data.platform,
          externalAccountId: data.externalAccountId,
        },
      },
      create: {
        agencyId: user.agencyId,
        clientId: data.clientId,
        platform: data.platform,
        externalAccountId: data.externalAccountId,
        accountName: data.accountName || null,
        status: 'CONNECTED',
      },
      update: {
        clientId: data.clientId,
        accountName: data.accountName || null,
        status: 'CONNECTED',
      },
    })
    const { accessToken, refreshToken, ...safe } = integration
    return ok(safe, 201)
  } catch (err) {
    return handleError(err)
  }
}
