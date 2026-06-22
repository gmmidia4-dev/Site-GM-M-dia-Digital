import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'

const API = `https://graph.facebook.com/${process.env.META_API_VERSION || 'v21.0'}`

/**
 * Adaptador Meta Ads (Facebook/Instagram) via Graph API — Marketing Insights.
 * Docs: https://developers.facebook.com/docs/marketing-api/insights
 */
export const metaAdapter: PlatformAdapter = {
  platform: 'META_ADS',
  label: 'Meta Ads',

  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      client_id: process.env.META_APP_ID || '',
      redirect_uri: process.env.META_REDIRECT_URI || '',
      state,
      scope: 'ads_read,business_management',
      response_type: 'code',
    })
    return `https://www.facebook.com/${process.env.META_API_VERSION || 'v21.0'}/dialog/oauth?${params}`
  },

  async exchangeCode(code: string): Promise<TokenSet> {
    const params = new URLSearchParams({
      client_id: process.env.META_APP_ID || '',
      client_secret: process.env.META_APP_SECRET || '',
      redirect_uri: process.env.META_REDIRECT_URI || '',
      code,
    })
    const res = await fetch(`${API}/oauth/access_token?${params}`)
    if (!res.ok) throw new Error(`Meta OAuth falhou: ${res.status}`)
    const json = (await res.json()) as { access_token: string; expires_in?: number }
    return {
      accessToken: json.access_token,
      expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
      scope: 'ads_read',
    }
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('META_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }

    const fields = [
      'spend',
      'impressions',
      'reach',
      'clicks',
      'actions',
      'action_values',
      'campaign_id',
      'campaign_name',
    ].join(',')
    const params = new URLSearchParams({
      level: 'campaign',
      time_increment: '1',
      time_range: JSON.stringify({ since: ctx.startDate, until: ctx.endDate }),
      fields,
      limit: '500',
      access_token: ctx.accessToken,
    })

    const rows: DailyInsight[] = []
    let url: string | null = `${API}/${ctx.externalAccountId}/insights?${params}`
    while (url) {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Meta Insights falhou: ${res.status}`)
      const json: any = await res.json()
      for (const r of json.data ?? []) {
        const leads = pickAction(r.actions, ['lead', 'onsite_conversion.lead_grouped'])
        const conversions = pickAction(r.actions, ['offsite_conversion.fb_pixel_purchase', 'purchase', 'lead'])
        const revenue = pickAction(r.action_values, ['offsite_conversion.fb_pixel_purchase', 'purchase'])
        rows.push({
          date: r.date_start,
          campaignId: r.campaign_id,
          campaignName: r.campaign_name,
          spend: Number(r.spend ?? 0),
          impressions: Number(r.impressions ?? 0),
          reach: Number(r.reach ?? 0),
          clicks: Number(r.clicks ?? 0),
          conversions,
          leads,
          revenue,
        })
      }
      url = json.paging?.next ?? null
    }
    return rows
  },
}

function pickAction(actions: any[] | undefined, types: string[]): number {
  if (!actions) return 0
  return actions
    .filter((a) => types.includes(a.action_type))
    .reduce((sum, a) => sum + Number(a.value ?? 0), 0)
}
