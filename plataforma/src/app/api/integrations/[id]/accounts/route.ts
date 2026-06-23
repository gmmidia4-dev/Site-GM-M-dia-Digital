import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireStaff, AuthError } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'
import { listIntegrationAccounts } from '@/lib/integrations'

/** Lista as contas de anúncios disponíveis para a integração (pós-OAuth). */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    const integration = await prisma.integration.findUnique({ where: { id: params.id } })
    if (!integration || integration.agencyId !== user.agencyId) {
      throw new AuthError('Integração não encontrada', 404)
    }
    const accounts = await listIntegrationAccounts(integration)
    return ok({ platform: integration.platform, accounts })
  } catch (err) {
    return handleError(err)
  }
}
