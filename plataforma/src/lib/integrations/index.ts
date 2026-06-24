import type { Integration, Platform } from '@prisma/client'
import { prisma } from '@/lib/db'
import { decrypt, encrypt } from '@/lib/crypto'
import type { PlatformAdapter, AdAccountOption } from './types'
import { metaAdapter } from './meta'
import { googleAdsAdapter } from './google'
import { tiktokAdapter } from './tiktok'
import { linkedinAdapter } from './linkedin'
import { ga4Adapter } from './ga4'
import { searchConsoleAdapter } from './searchconsole'

export const ADAPTERS: Record<Platform, PlatformAdapter> = {
  META_ADS: metaAdapter,
  GOOGLE_ADS: googleAdsAdapter,
  TIKTOK_ADS: tiktokAdapter,
  LINKEDIN_ADS: linkedinAdapter,
  GA4: ga4Adapter,
  SEARCH_CONSOLE: searchConsoleAdapter,
}

export function getAdapter(platform: Platform): PlatformAdapter {
  return ADAPTERS[platform]
}

const REFRESH_SKEW_MS = 5 * 60 * 1000 // renova 5 min antes de expirar

/**
 * Devolve um access token válido para a integração, renovando-o (e persistindo
 * a versão cifrada) quando estiver próximo de expirar. Retorna null quando não
 * há token (modo demo / conexão manual).
 */
export async function getValidAccessToken(integration: Integration): Promise<string | null> {
  if (!integration.accessToken) return null
  const current = safeDecrypt(integration.accessToken)
  if (!current) return null

  const adapter = getAdapter(integration.platform)
  const expiringSoon = integration.expiresAt
    ? integration.expiresAt.getTime() - Date.now() < REFRESH_SKEW_MS
    : false

  if (!expiringSoon || !adapter.refresh || !integration.refreshToken) {
    return current
  }

  try {
    const refreshToken = safeDecrypt(integration.refreshToken)
    if (!refreshToken) return current
    const tokens = await adapter.refresh(refreshToken)
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: encrypt(tokens.accessToken),
        refreshToken: tokens.refreshToken ? encrypt(tokens.refreshToken) : undefined,
        expiresAt: tokens.expiresAt,
        status: 'CONNECTED',
      },
    })
    return tokens.accessToken
  } catch (err) {
    console.error(`Falha ao renovar token (${integration.platform}):`, err)
    await prisma.integration.update({ where: { id: integration.id }, data: { status: 'EXPIRED' } })
    return current
  }
}

/** Lista as contas de anúncios disponíveis para uma integração recém-conectada. */
export async function listIntegrationAccounts(integration: Integration): Promise<AdAccountOption[]> {
  const adapter = getAdapter(integration.platform)
  if (!adapter.listAccounts) return []
  const token = await getValidAccessToken(integration)
  if (!token) return []
  return adapter.listAccounts(token)
}

/**
 * Sincroniza uma integração: busca as métricas diárias no período e faz
 * upsert em MetricDaily. Atualiza o status (CONNECTED/ERROR) ao final.
 */
export async function syncIntegration(
  integration: Integration,
  startDate: string,
  endDate: string
): Promise<number> {
  const adapter = getAdapter(integration.platform)

  try {
    const accessToken = await getValidAccessToken(integration)
    const insights = await adapter.fetchInsights({
      externalAccountId: integration.externalAccountId,
      accessToken,
      startDate,
      endDate,
    })

    for (const row of insights) {
      await prisma.metricDaily.upsert({
        where: {
          integrationId_date_campaignId: {
            integrationId: integration.id,
            date: new Date(row.date),
            campaignId: row.campaignId ?? '',
          },
        },
        create: {
          integrationId: integration.id,
          date: new Date(row.date),
          campaignId: row.campaignId ?? '',
          campaignName: row.campaignName,
          spend: row.spend,
          impressions: row.impressions,
          reach: row.reach,
          clicks: row.clicks,
          conversions: row.conversions,
          leads: row.leads,
          revenue: row.revenue,
        },
        update: {
          spend: row.spend,
          impressions: row.impressions,
          reach: row.reach,
          clicks: row.clicks,
          conversions: row.conversions,
          leads: row.leads,
          revenue: row.revenue,
          campaignName: row.campaignName,
        },
      })
    }

    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncedAt: new Date(), status: 'CONNECTED' },
    })

    return insights.length
  } catch (err) {
    await prisma.integration.update({ where: { id: integration.id }, data: { status: 'ERROR' } })
    throw err
  }
}

function safeDecrypt(value: string): string | null {
  try {
    return decrypt(value)
  } catch {
    return null
  }
}

export * from './types'
