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

/** Conta de anúncios disponível para vincular após o OAuth. */
export interface AdAccountOption {
  id: string
  name: string
  currency?: string
}

export interface FetchContext {
  externalAccountId: string
  accessToken?: string | null
  startDate: string // yyyy-mm-dd
  endDate: string // yyyy-mm-dd
}

/**
 * Contrato implementado por cada plataforma (Meta, Google Ads, TikTok, etc.).
 * O fluxo OAuth e a listagem de contas são opcionais por plataforma.
 */
export interface PlatformAdapter {
  platform: Platform
  label: string
  /** Gera a URL de consentimento OAuth. */
  getAuthUrl?(state: string): string
  /** Troca o `code` do callback por tokens de acesso. */
  exchangeCode?(code: string): Promise<TokenSet>
  /** Renova o access token a partir do refresh token. */
  refresh?(refreshToken: string): Promise<TokenSet>
  /** Lista as contas de anúncios acessíveis com o token (pós-OAuth). */
  listAccounts?(accessToken: string): Promise<AdAccountOption[]>
  /** Coleta as métricas diárias do período informado. */
  fetchInsights(ctx: FetchContext): Promise<DailyInsight[]>
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE !== 'false'
}

/** Converte yyyy-mm-dd em partes numéricas (usado por algumas APIs). */
export function dateParts(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split('-').map(Number)
  return { year, month, day }
}

/** Itera dia a dia entre duas datas ISO (inclusive). */
export function eachDay(start: string, end: string): string[] {
  const days: string[] = []
  const d = new Date(start + 'T00:00:00Z')
  const last = new Date(end + 'T00:00:00Z')
  while (d <= last) {
    days.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return days
}
