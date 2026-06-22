import type { PlatformAdapter, FetchContext, DailyInsight } from './types'
import { isDemoMode } from './types'
import { generateDemoInsights } from './demo'
import { googleAuthUrl, googleExchangeCode } from './google'

/**
 * Adaptador Google Search Console — Search Analytics API.
 * Docs: https://developers.google.com/webmaster-tools/v1/searchanalytics/query
 * Mapeia clicks/impressions (e CTR) da busca orgânica por dia.
 */
export const searchConsoleAdapter: PlatformAdapter = {
  platform: 'SEARCH_CONSOLE',
  label: 'Search Console',
  getAuthUrl: googleAuthUrl,
  exchangeCode: googleExchangeCode,

  async fetchInsights(ctx: FetchContext): Promise<DailyInsight[]> {
    if (isDemoMode() || !ctx.accessToken) {
      return generateDemoInsights('SEARCH_CONSOLE', ctx.externalAccountId, ctx.startDate, ctx.endDate)
    }
    // TODO(produção): POST https://www.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query
    throw new Error('Integração Search Console em produção pendente de credenciais.')
  },
}
