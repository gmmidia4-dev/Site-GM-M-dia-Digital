import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'

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
    const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: process.env.TIKTOK_APP_ID,
        secret: process.env.TIKTOK_APP_SECRET,
        auth_code: code,
      }),
    })
    if (!res.ok) throw new Error(`TikTok OAuth falhou: ${res.status}`)
    const json = (await res.json()) as any
    return { accessToken: json.data?.access_token, scope: json.data?.scope?.join(',') }
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('TIKTOK_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }
    // TODO(produção): GET /open_api/v1.3/report/integrated/get/ com
    // data_level=AUCTION_CAMPAIGN, dimensions=[campaign_id, stat_time_day] e
    // metrics=[spend, impressions, reach, clicks, conversions, complete_payment].
    throw new Error('Integração TikTok Ads em produção pendente de credenciais.')
  },
}
