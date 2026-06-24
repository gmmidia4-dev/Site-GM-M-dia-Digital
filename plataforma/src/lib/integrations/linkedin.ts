import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet, AdAccountOption } from './types'
import { isDemoMode, dateParts } from './types'
import { generateDemoInsights } from './demo'
import { fetchJson } from './http'

const VERSION = '202401'

function liHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    'LinkedIn-Version': VERSION,
    'X-Restli-Protocol-Version': '2.0.0',
  }
}

/**
 * Adaptador LinkedIn Ads — Reporting API (adAnalytics).
 * Docs: https://learn.microsoft.com/linkedin/marketing/integrations/ads-reporting
 */
export const linkedinAdapter: PlatformAdapter = {
  platform: 'LINKEDIN_ADS',
  label: 'LinkedIn Ads',

  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID || '',
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI || '',
      state,
      scope: 'r_ads_reporting r_ads',
    })
    return `https://www.linkedin.com/oauth/v2/authorization?${params}`
  },

  async exchangeCode(code: string): Promise<TokenSet> {
    const json = await fetchJson<any>('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || '',
      }),
    })
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
    }
  },

  async refresh(refreshToken: string): Promise<TokenSet> {
    const json = await fetchJson<any>('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
      }),
    })
    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token ?? refreshToken,
      expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
    }
  },

  async listAccounts(accessToken: string): Promise<AdAccountOption[]> {
    const json = await fetchJson<any>('https://api.linkedin.com/rest/adAccounts?q=search', {
      headers: liHeaders(accessToken),
    })
    return (json.elements ?? []).map((a: any) => ({ id: String(a.id), name: a.name || `Conta ${a.id}` }))
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('LINKEDIN_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }

    const s = dateParts(ctx.startDate)
    const e = dateParts(ctx.endDate)
    const dateRange = `(start:(year:${s.year},month:${s.month},day:${s.day}),end:(year:${e.year},month:${e.month},day:${e.day}))`
    const account = `List(urn%3Ali%3AsponsoredAccount%3A${ctx.externalAccountId})`
    const fields = 'dateRange,costInLocalCurrency,impressions,clicks,externalWebsiteConversions,pivotValues'

    const url =
      `https://api.linkedin.com/rest/adAnalytics?q=analytics&pivot=CAMPAIGN&timeGranularity=DAILY` +
      `&dateRange=${dateRange}&accounts=${account}&fields=${fields}`

    const json = await fetchJson<any>(url, { headers: liHeaders(ctx.accessToken) })

    return (json.elements ?? []).map((el: any) => {
      const d = el.dateRange?.start ?? {}
      const date = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
      const conversions = Number(el.externalWebsiteConversions ?? 0)
      return {
        date,
        campaignId: String(el.pivotValues?.[0] ?? ''),
        campaignName: 'LinkedIn',
        spend: Number(el.costInLocalCurrency ?? 0),
        impressions: Number(el.impressions ?? 0),
        reach: 0,
        clicks: Number(el.clicks ?? 0),
        conversions: Math.round(conversions),
        leads: Math.round(conversions),
        revenue: 0,
      }
    })
  },
}
