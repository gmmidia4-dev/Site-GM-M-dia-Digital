import type { PlatformAdapter, FetchContext, DailyInsight, AdAccountOption } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'
import { googleAuthUrl, googleExchangeCode, googleRefresh } from './google'
import { fetchJson } from './http'

/**
 * Adaptador Google Search Console — Search Analytics API.
 * Docs: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
 */
export const searchConsoleAdapter: PlatformAdapter = {
  platform: 'SEARCH_CONSOLE',
  label: 'Search Console',
  getAuthUrl: googleAuthUrl,
  exchangeCode: googleExchangeCode,
  refresh: googleRefresh,

  async listAccounts(accessToken: string): Promise<AdAccountOption[]> {
    const json = await fetchJson<any>('https://www.googleapis.com/webmasters/v3/sites', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return (json.siteEntry ?? []).map((s: any) => ({ id: s.siteUrl, name: s.siteUrl }))
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('SEARCH_CONSOLE', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }

    const site = encodeURIComponent(ctx.externalAccountId)
    const json = await fetchJson<any>(
      `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${ctx.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: ctx.startDate, endDate: ctx.endDate, dimensions: ['date'] }),
      }
    )

    return (json.rows ?? []).map((row: any) => ({
      date: row.keys?.[0],
      campaignName: 'Busca orgânica',
      spend: 0,
      impressions: Number(row.impressions ?? 0),
      reach: 0,
      clicks: Number(row.clicks ?? 0),
      conversions: 0,
      leads: 0,
      revenue: 0,
    }))
  },
}
