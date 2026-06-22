import type { Integration, Platform } from '@prisma/client'
import { prisma } from '@/lib/db'
import { decrypt } from '@/lib/crypto'
import type { PlatformAdapter } from './types'
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

/**
 * Sincroniza uma integração: busca as métricas diárias no período e faz
 * upsert em MetricDaily. Retorna a quantidade de linhas processadas.
 */
export async function syncIntegration(
  integration: Integration,
  startDate: string,
  endDate: string
): Promise<number> {
  const adapter = getAdapter(integration.platform)
  const accessToken = integration.accessToken ? safeDecrypt(integration.accessToken) : null

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
    data: { lastSyncedAt: new Date() },
  })

  return insights.length
}

function safeDecrypt(value: string): string | null {
  try {
    return decrypt(value)
  } catch {
    return null
  }
}

export * from './types'
