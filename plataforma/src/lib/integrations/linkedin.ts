import type { PlatformAdapter, FetchContext, DailyInsight, TokenSet } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'

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
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
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
    if (!res.ok) throw new Error(`LinkedIn OAuth falhou: ${res.status}`)
    const json = (await res.json()) as any
    return {
      accessToken: json.access_token,
      expiresAt: json.expires_in ? new Date(Date.now() + json.expires_in * 1000) : undefined,
    }
  },

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('LINKEDIN_ADS', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }
    // TODO(produção): GET /rest/adAnalytics com pivot=CAMPAIGN, timeGranularity=DAILY
    // e fields=costInLocalCurrency,impressions,clicks,externalWebsiteConversions.
    throw new Error('Integração LinkedIn Ads em produção pendente de credenciais.')
  },
}
