import type { Platform } from '@prisma/client'
import type { DerivedMetrics, MetricComparison } from './metrics'

/** Série temporal de uma métrica para gráficos. */
export interface TimeSeriesPoint {
  date: string // ISO (yyyy-mm-dd)
  spend: number
  impressions: number
  clicks: number
  leads: number
  conversions: number
  revenue: number
}

/** Recorte agregado por plataforma. */
export interface PlatformBreakdown {
  platform: Platform
  label: string
  metrics: DerivedMetrics
  share: number // participação no investimento total (%)
}

/** Pacote de dados que alimenta um relatório (e o snapshot persistido). */
export interface ReportData {
  client: {
    id: string
    name: string
    logoUrl?: string | null
  }
  period: {
    start: string
    end: string
    label: string
  }
  comparison: MetricComparison
  series: TimeSeriesPoint[]
  platforms: PlatformBreakdown[]
  topCampaigns: {
    name: string
    platform: Platform
    spend: number
    leads: number
    roas: number
  }[]
  branding: {
    primary: string
    secondary: string
    logoUrl?: string | null
    agencyName: string
  }
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  META_ADS: 'Meta Ads',
  GOOGLE_ADS: 'Google Ads',
  TIKTOK_ADS: 'TikTok Ads',
  LINKEDIN_ADS: 'LinkedIn Ads',
  GA4: 'Google Analytics 4',
  SEARCH_CONSOLE: 'Search Console',
}

/** Plataformas que fornecem métricas de mídia paga (entram nos KPIs). */
export const AD_PLATFORMS: Platform[] = [
  'META_ADS',
  'GOOGLE_ADS',
  'TIKTOK_ADS',
  'LINKEDIN_ADS',
]
