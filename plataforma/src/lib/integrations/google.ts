import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'

/** Escopos OAuth do Google usados por Ads, GA4 e Search Console. */
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/adwords',
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
  'openid',
  'email',
]

export function googleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state,
    scope: GOOGLE_SCOPES.join(' '),
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function googleExchangeCode(code: string): Promise<TokenSet> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
      grant_type: 'authorization_code',
      code,
    }),
  })
  if (!res.ok) throw new Error(`Google OAuth falhou: ${res.status}`)
  const json = (await res.json()) as any
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
    scope: json.scope,
  }
}

/**
 * Adaptador Google Ads — Google Ads API (GAQL via searchStream).
 * Docs: https://developers.google.com/google-ads/api/docs/reporting/overview
 *
 * A consulta real (GAQL) seria, resumidamente:
 *   SELECT segments.date, campaign.id, campaign.name, metrics.cost_micros,
 *          metrics.impressions, metrics.clicks, metrics.conversions,
 *          metrics.conversions_value
 *   FROM campaign WHERE segments.date BETWEEN '...' AND '...'
 */
export const googleAdsAdapter: PlatformAdapter = {
  platform: 'GOOGLE_ADS',
  label: 'Google Ads',
  getAuthUrl: googleAuthUrl,
  exchangeCode: googleExchangeCode,

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('GOOGLE_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }
    // TODO(produção): POST para
    // https://googleads.googleapis.com/v18/customers/{id}/googleAds:searchStream
    // com headers Authorization, developer-token e login-customer-id, mapeando
    // cost_micros/1e6 -> spend e conversions_value -> revenue.
    return fetchGoogleAds(ctx)
  },
}

async function fetchGoogleAds(_ctx: FetchContext): Promise<DailyInsight[]> {
  throw new Error(
    'Integração Google Ads em produção requer developer-token aprovado. Mantenha DEMO_MODE=true até concluir o cadastro na Google.'
  )
}
