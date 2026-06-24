import { prisma } from '@/lib/db'
import { compare, aggregate, type RawMetrics } from '@/lib/metrics'
import { PLATFORM_LABELS, AD_PLATFORMS, type ReportData, type TimeSeriesPoint, type PlatformBreakdown } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import type { Platform } from '@prisma/client'

interface MetricRow {
  date: Date
  spend: any
  impressions: number
  reach: number
  clicks: number
  conversions: number
  leads: number
  revenue: any
  campaignName: string | null
  integration: { platform: Platform }
}

function toRaw(r: MetricRow): RawMetrics {
  return {
    spend: Number(r.spend),
    impressions: r.impressions,
    reach: r.reach,
    clicks: r.clicks,
    conversions: r.conversions,
    leads: r.leads,
    revenue: Number(r.revenue),
  }
}

/** Janela anterior de mesmo comprimento imediatamente antes de `start`. */
export function previousWindow(start: Date, end: Date): { start: Date; end: Date } {
  const ms = end.getTime() - start.getTime()
  const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000)
  const prevStart = new Date(prevEnd.getTime() - ms)
  return { start: prevStart, end: prevEnd }
}

/**
 * Monta o pacote completo de dados de um relatório a partir das métricas
 * persistidas. Considera apenas plataformas de mídia paga nos KPIs.
 */
export async function buildReportData(
  clientId: string,
  startDate: Date,
  endDate: Date
): Promise<ReportData> {
  const client = await prisma.client.findUniqueOrThrow({
    where: { id: clientId },
    include: { agency: true },
  })

  const prev = previousWindow(startDate, endDate)

  const baseWhere = {
    integration: { clientId, platform: { in: AD_PLATFORMS } },
  }

  const [currentRows, previousRows] = await Promise.all([
    prisma.metricDaily.findMany({
      where: { ...baseWhere, date: { gte: startDate, lte: endDate } },
      include: { integration: { select: { platform: true } } },
    }),
    prisma.metricDaily.findMany({
      where: { ...baseWhere, date: { gte: prev.start, lte: prev.end } },
      include: { integration: { select: { platform: true } } },
    }),
  ])

  const comparison = compare(
    currentRows.map(toRaw),
    previousRows.map(toRaw)
  )

  // Série temporal diária (somando todas as plataformas)
  const byDate = new Map<string, TimeSeriesPoint>()
  for (const r of currentRows as MetricRow[]) {
    const key = r.date.toISOString().slice(0, 10)
    const point = byDate.get(key) ?? {
      date: key,
      spend: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      conversions: 0,
      revenue: 0,
    }
    point.spend += Number(r.spend)
    point.impressions += r.impressions
    point.clicks += r.clicks
    point.leads += r.leads
    point.conversions += r.conversions
    point.revenue += Number(r.revenue)
    byDate.set(key, point)
  }
  const series = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date))

  // Quebra por plataforma
  const totalSpend = comparison.current.spend || 1
  const platformMap = new Map<Platform, MetricRow[]>()
  for (const r of currentRows as MetricRow[]) {
    const arr = platformMap.get(r.integration.platform) ?? []
    arr.push(r)
    platformMap.set(r.integration.platform, arr)
  }
  const platforms: PlatformBreakdown[] = Array.from(platformMap.entries())
    .map(([platform, rows]) => {
      const metrics = aggregate(rows.map(toRaw))
      return {
        platform,
        label: PLATFORM_LABELS[platform],
        metrics,
        share: (metrics.spend / totalSpend) * 100,
      }
    })
    .sort((a, b) => b.metrics.spend - a.metrics.spend)

  // Top campanhas por investimento
  const campaignMap = new Map<string, { name: string; platform: Platform; rows: MetricRow[] }>()
  for (const r of currentRows as MetricRow[]) {
    const name = r.campaignName ?? 'Sem nome'
    const key = `${r.integration.platform}:${name}`
    const entry = campaignMap.get(key) ?? { name, platform: r.integration.platform, rows: [] }
    entry.rows.push(r)
    campaignMap.set(key, entry)
  }
  const topCampaigns = Array.from(campaignMap.values())
    .map((c) => {
      const m = aggregate(c.rows.map(toRaw))
      return { name: c.name, platform: c.platform, spend: m.spend, leads: m.leads, roas: m.roas }
    })
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5)

  return {
    client: { id: client.id, name: client.name, logoUrl: client.logoUrl },
    period: {
      start: startDate.toISOString().slice(0, 10),
      end: endDate.toISOString().slice(0, 10),
      label: `${formatDate(startDate)} — ${formatDate(endDate)}`,
    },
    comparison,
    series,
    platforms,
    topCampaigns,
    branding: {
      primary: client.brandPrimary || client.agency.brandPrimary,
      secondary: client.agency.brandSecondary,
      logoUrl: client.logoUrl || client.agency.logoUrl,
      agencyName: client.agency.name,
    },
  }
}
