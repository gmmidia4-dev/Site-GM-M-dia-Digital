import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet, AdAccountOption } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'
import { fetchJson } from './http'

const BASE = 'https://business-api.tiktok.com/open_api/v1.3'

/**
 * Adaptador TikTok Ads — Reporting API.
 * Docs: https://business-api.tiktok.com/portal/docs?id=1740302848100353
 */
export const tiktokAdapter: PlatformAdapter = {
  platform: 'TIKTOK_ADS',
  label: 'TikTok Ads',

  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      app_id: process.env.TIKTOK_APP_ID || '',
      redirect_uri: process.env.TIKTOK_REDIRECT_URI || '',
      state,
    })
    return `https://business-api.tiktok.com/portal/auth?${params}`
  },

  async exchangeCode(code: string): Promise<TokenSet> {
    const json = await fetchJson<any>(`${BASE}/oauth2/access_token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: process.env.TIKTOK_APP_ID,
        secret: process.env.TIKTOK_APP_SECRET,
        auth_code: code,
      }),
    })
    return { accessToken: json.data?.access_token, scope: (json.data?.scope ?? []).join(',') }
  },

  async listAccounts(accessToken: string): Promise<AdAccountOption[]> {
    const params = new URLSearchParams({
      app_id: process.env.TIKTOK_APP_ID || '',
      secret: process.env.TIKTOK_APP_SECRET || '',
    })
    const json = await fetchJson<any>(`${BASE}/oauth2/advertiser/get/?${params}`, {
      headers: { 'Access-Token': accessToken },
    })
    return (json.data?.list ?? []).map((a: any) => ({ id: a.advertiser_id, name: a.advertiser_name }))
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('TIKTOK_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }

    const params = new URLSearchParams({
      advertiser_id: ctx.externalAccountId,
      report_type: 'BASIC',
      data_level: 'AUCTION_CAMPAIGN',
      dimensions: JSON.stringify(['campaign_id', 'stat_time_day']),
      metrics: JSON.stringify([
        'campaign_name',
        'spend',
        'impressions',
        'reach',
        'clicks',
        'conversion',
        'total_complete_payment_value',
      ]),
      start_date: ctx.startDate,
      end_date: ctx.endDate,
      page_size: '1000',
    })

    const json = await fetchJson<any>(`${BASE}/report/integrated/get/?${params}`, {
      headers: { 'Access-Token': ctx.accessToken },
    })

    return (json.data?.list ?? []).map((item: any) => {
      const d = item.dimensions ?? {}
      const m = item.metrics ?? {}
      const conversions = Number(m.conversion ?? 0)
      return {
        date: String(d.stat_time_day ?? '').slice(0, 10),
        campaignId: String(d.campaign_id ?? ''),
        campaignName: m.campaign_name,
        spend: Number(m.spend ?? 0),
        impressions: Number(m.impressions ?? 0),
        reach: Number(m.reach ?? 0),
        clicks: Number(m.clicks ?? 0),
        conversions: Math.round(conversions),
        leads: Math.round(conversions),
        revenue: Number(m.total_complete_payment_value ?? 0),
      }
    })
  },
}
