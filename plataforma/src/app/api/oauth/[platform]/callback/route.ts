import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireStaff } from '@/lib/rbac'
import { handleError } from '@/lib/api'
import { getAdapter } from '@/lib/integrations'
import { encrypt, decrypt, randomToken } from '@/lib/crypto'
import { appUrl } from '@/lib/utils'
import type { Platform } from '@prisma/client'

const PLATFORM_MAP: Record<string, Platform> = {
  meta: 'META_ADS',
  google: 'GOOGLE_ADS',
  tiktok: 'TIKTOK_ADS',
  linkedin: 'LINKEDIN_ADS',
  ga4: 'GA4',
  searchconsole: 'SEARCH_CONSOLE',
}

/**
 * Callback OAuth: troca o code por tokens, cria a integração (pendente de
 * seleção de conta) e redireciona para a tela de seleção de conta.
 */
export async function GET(req: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const user = await requireStaff()
    const platform = PLATFORM_MAP[params.platform]
    const code = req.nextUrl.searchParams.get('code')
    const state = req.nextUrl.searchParams.get('state')
    if (!platform || !code || !state) {
      return NextResponse.redirect(appUrl('/integracoes?error=oauth'))
    }

    const decoded = JSON.parse(decrypt(state)) as { clientId: string; agencyId: string }
    if (decoded.agencyId !== user.agencyId) {
      return NextResponse.redirect(appUrl('/integracoes?error=forbidden'))
    }

    const adapter = getAdapter(platform)
    if (!adapter.exchangeCode) {
      return NextResponse.redirect(appUrl('/integracoes?error=unsupported'))
    }
    const tokens = await adapter.exchangeCode(code)

    // Conta ainda não escolhida → placeholder único para evitar colisão.
    const externalAccountId = tokens.externalAccountId || `pending:${randomToken(8)}`

    const integration = await prisma.integration.create({
      data: {
        agencyId: user.agencyId,
        clientId: decoded.clientId,
        platform,
        externalAccountId,
        accountName: tokens.accountName,
        accessToken: tokens.accessToken ? encrypt(tokens.accessToken) : null,
        refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
        expiresAt: tokens.expiresAt,
        scope: tokens.scope,
        status: tokens.externalAccountId ? 'CONNECTED' : 'DISCONNECTED',
      },
    })

    // Se a plataforma permite listar contas, leva à seleção; senão, conclui.
    if (!tokens.externalAccountId && adapter.listAccounts) {
      return NextResponse.redirect(appUrl(`/integracoes/selecionar?id=${integration.id}`))
    }
    return NextResponse.redirect(appUrl('/integracoes?connected=1'))
  } catch (err) {
    return handleError(err)
  }
}
