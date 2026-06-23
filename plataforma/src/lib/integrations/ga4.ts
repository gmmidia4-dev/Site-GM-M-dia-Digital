import type { PlatformAdapter, FetchContext, DailyInsight, AdAccountOption } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'
import { googleAuthUrl, googleExchangeCode, googleRefresh } from './google'
import { fetchJson } from './http'

/**
 * Adaptador Google Analytics 4 — Data API (runReport) + Admin API (contas).
 * Docs: https://developers.google.com/analytics/devguides/reporting/data/v1
 */
export const ga4Adapter: PlatformAdapter = {
  platform: 'GA4',
  label: 'Google Analytics 4',
  getAuthUrl: googleAuthUrl,
  exchangeCode: googleExchangeCode,
  refresh: googleRefresh,

  async listAccounts(accessToken: string): Promise<AdAccountOption[]> {
    const json = await fetchJson<any>('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const out: AdAccountOption[] = []
    for (const acc of json.accountSummaries ?? []) {
      for (const prop of acc.propertySummaries ?? []) {
        out.push({ id: prop.property.replace('properties/', ''), name: prop.displayName })
      }
    }
    return out
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('GA4', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }

    const json = await fetchJson<any>(
      `https://analyticsdata.googleapis.com/v1beta/properties/${ctx.externalAccountId}:runReport`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${ctx.accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateRanges: [{ startDate: ctx.startDate, endDate: ctx.endDate }],
          dimensions: [{ name: 'date' }, { name: 'sessionCampaignName' }],
          metrics: [{ name: 'conversions' }, { name: 'totalRevenue' }, { name: 'sessions' }],
        }),
      }
    )

    return (json.rows ?? []).map((row: any) => {
      const raw = row.dimensionValues?.[0]?.value ?? '' // YYYYMMDD
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
      const conversions = Number(row.metricValues?.[0]?.value ?? 0)
      return {
        date,
        campaignName: row.dimensionValues?.[1]?.value || 'GA4',
        spend: 0,
        impressions: 0,
        reach: 0,
        clicks: Number(row.metricValues?.[2]?.value ?? 0), // sessões (proxy)
        conversions: Math.round(conversions),
        leads: Math.round(conversions),
        revenue: Number(row.metricValues?.[1]?.value ?? 0),
      }
    })
  },
}
