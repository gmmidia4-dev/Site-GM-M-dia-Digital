import type { PlatformAdapter, FetchContext, DailyInsight } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'
import { googleAuthUrl, googleExchangeCode } from './google'

/**
 * Adaptador Google Analytics 4 — Data API (runReport).
 * Docs: https://developers.google.com/analytics/devguides/reporting/data/v1
 * Métricas: sessions, conversions, totalRevenue por date/sessionCampaignName.
 */
export const ga4Adapter: PlatformAdapter = {
  platform: 'GA4',
  label: 'Google Analytics 4',
  getAuthUrl: googleAuthUrl,
  exchangeCode: googleExchangeCode,

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('GA4', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }
    // TODO(produção): POST https://analyticsdata.googleapis.com/v1beta/properties/{id}:runReport
    throw new Error('Integração GA4 em produção pendente de credenciais.')
  },
}
