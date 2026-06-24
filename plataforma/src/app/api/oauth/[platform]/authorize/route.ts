import { NextRequest, NextResponse } from 'next/server'
import { requireStaff } from '@/lib/rbac'
import { handleError } from '@/lib/api'
import { getAdapter } from '@/lib/integrations'
import { encrypt } from '@/lib/crypto'
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
 * Inicia o fluxo OAuth: redireciona para a tela de consentimento da plataforma.
 * O `state` carrega clientId + plataforma cifrados para validar no callback.
 */
export async function GET(req: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const user = await requireStaff()
    const platform = PLATFORM_MAP[params.platform]
    if (!platform) return NextResponse.json({ error: 'Plataforma inválida' }, { status: 400 })

    const clientId = req.nextUrl.searchParams.get('clientId')
    if (!clientId) return NextResponse.json({ error: 'clientId obrigatório' }, { status: 400 })

    const adapter = getAdapter(platform)
    if (!adapter.getAuthUrl) {
      return NextResponse.json({ error: 'Plataforma não suporta OAuth' }, { status: 400 })
    }

    const state = encrypt(JSON.stringify({ clientId, platform, agencyId: user.agencyId }))
    return NextResponse.redirect(adapter.getAuthUrl(state))
  } catch (err) {
    return handleError(err)
  }
}
