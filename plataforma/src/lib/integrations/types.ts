import type { Platform } from '@prisma/client'

/** Uma linha de métrica diária retornada por um adaptador de plataforma. */
export interface DailyInsight {
  date: string // yyyy-mm-dd
  campaignId?: string
  campaignName?: string
  spend: number
  impressions: number
  reach: number
  clicks: number
  conversions: number
  leads: number
  revenue: number
}

export interface TokenSet {
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  scope?: string
  externalAccountId?: string
  accountName?: string
}

export interface FetchContext {
  externalAccountId: string
  accessToken?: string | null
  startDate: string // yyyy-mm-dd
  endDate: string // yyyy-mm-dd
}

/**
 * Contrato implementado por cada plataforma (Meta, Google Ads, TikTok, etc.).
 * O fluxo OAuth é opcional para fontes que usam outro tipo de autenticação.
 */
export interface PlatformAdapter {
  platform: Platform
  label: string
  /** Gera a URL de consentimento OAuth. */
  getAuthUrl?(state: string): string
  /** Troca o `code` do callback por tokens de acesso. */
  exchangeCode?(code: string): Promise<TokenSet>
  /** Coleta as métricas diárias do período informado. */
  fetchInsights(ctx: FetchContext): Promise<DailyInsight[]>
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false'
}
