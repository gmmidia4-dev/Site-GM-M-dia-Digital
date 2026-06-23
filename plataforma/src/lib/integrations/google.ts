import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet, AdAccountOption } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'
import { fetchJson } from './http'

const ADS_VERSION = 'v18'

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
  const json = await fetchJson<any>('https://oauth2.googleapis.com/token', {
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
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
    scope: json.scope,
  }
}

/** Renova o access token Google a partir do refresh token. */
export async function googleRefresh(refreshToken: string): Promise<TokenSet> {
  const json = await fetchJson<any>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  return {
    accessToken: json.access_token,
    refreshToken, // Google não devolve novo refresh token
    expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
  }
}

function adsHeaders(accessToken: string): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    'Content-Type': 'application/json',
  }
  if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) {
    headers['login-customer-id'] = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID.replace(/-/g, '')
  }
  return headers
}

/**
 * Adaptador Google Ads — Google Ads API (GAQL via searchStream).
 * Docs: https://developers.google.com/google-ads/api/docs/reporting/overview
 */
export const googleAdsAdapter: PlatformAdapter = {
  platform: 'GOOGLE_ADS',
  label: 'Google Ads',
  getAuthUrl: googleAuthUrl,
  exchangeCode: googleExchangeCode,
  refresh: googleRefresh,

  async listAccounts(accessToken: string): Promise<AdAccountOption[]> {
    const json = await fetchJson<{ resourceNames?: string[] }>(
      `https://googleads.googleapis.com/${ADS_VERSION}/customers:listAccessibleCustomers`,
      { headers: adsHeaders(accessToken) }
    )
    return (json.resourceNames ?? []).map((rn) => {
      const id = rn.replace('customers/', '')
      return { id, name: `Conta ${id}` }
    })
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('GOOGLE_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }

    const customerId = ctx.externalAccountId.replace(/-/g, '')
    const query = `SELECT segments.date, campaign.id, campaign.name,
      metrics.cost_micros, metrics.impressions, metrics.clicks,
      metrics.conversions, metrics.conversions_value
      FROM campaign
      WHERE segments.date BETWEEN '${ctx.startDate}' AND '${ctx.endDate}'`

    const batches = await fetchJson<any[]>(
      `https://googleads.googleapis.com/${ADS_VERSION}/customers/${customerId}/googleAds:searchStream`,
      { method: 'POST', headers: adsHeaders(ctx.accessToken), body: JSON.stringify({ query }) }
    )

    const rows: DailyInsight[] = []
    for (const batch of batches ?? []) {
      for (const r of batch.results ?? []) {
        const conversions = Number(r.metrics?.conversions ?? 0)
        rows.push({
          date: r.segments?.date,
          campaignId: String(r.campaign?.id ?? ''),
          campaignName: r.campaign?.name,
          spend: Number(r.metrics?.costMicros ?? 0) / 1_000_000,
          impressions: Number(r.metrics?.impressions ?? 0),
          reach: 0,
          clicks: Number(r.metrics?.clicks ?? 0),
          conversions: Math.round(conversions),
          leads: Math.round(conversions),
          revenue: Number(r.metrics?.conversionsValue ?? 0),
        })
      }
    }
    return rows
  },
}
