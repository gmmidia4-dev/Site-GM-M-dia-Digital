import { prisma } from '@/lib/db'
import { compare, aggregate, type RawMetrics } from '@/lib/metrics'
import { AD_PLATFORMS } from '@/lib/types'
import { previousWindow } from './build'

function toRaw(r: any): RawMetrics {
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

export interface ClientOverview {
  id: string
  name: string
  logoUrl: string | null
  spend: number
  leads: number
  cpl: number
  roas: number
}

/**
 * Visão geral da agência para o dashboard: KPIs comparados ao período anterior,
 * série temporal e ranking de clientes — tudo no intervalo informado.
 */
export async function buildAgencyOverview(agencyId: string, days = 30, clientIds?: string[]) {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  const prev = previousWindow(start, end)

  const clientFilter = clientIds ? { in: clientIds } : undefined
  const where = (from: Date, to: Date) => ({
    date: { gte: from, lte: to },
    integration: {
      agencyId,
      platform: { in: AD_PLATFORMS },
      ...(clientFilter ? { clientId: clientFilter } : {}),
    },
  })

  const [currentRows, previousRows, clients] = await Promise.all([
    prisma.metricDaily.findMany({
      where: where(start, end),
      include: { integration: { select: { clientId: true } } },
    }),
    prisma.metricDaily.findMany({ where: where(prev.start, prev.end) }),
    prisma.client.findMany({
      where: { agencyId, ...(clientIds ? { id: { in: clientIds } } : {}) },
      select: { id: true, name: true, logoUrl: true },
    }),
  ])

  const comparison = compare(currentRows.map(toRaw), previousRows.map(toRaw))

  // série diária
  const byDate = new Map<string, any>()
  for (const r of currentRows) {
    const key = r.date.toISOString().slice(0, 10)
    const p = byDate.get(key) ?? { date: key, spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, revenue: 0 }
    p.spend += Number(r.spend)
    p.impressions += r.impressions
    p.clicks += r.clicks
    p.leads += r.leads
    p.conversions += r.conversions
    p.revenue += Number(r.revenue)
    byDate.set(key, p)
  }
  const series = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date))

  // ranking por cliente
  const perClient = new Map<string, any[]>()
  for (const r of currentRows as any[]) {
    const cid = r.integration.clientId
    if (!cid) continue
    const arr = perClient.get(cid) ?? []
    arr.push(r)
    perClient.set(cid, arr)
  }
  const clientOverviews: ClientOverview[] = clients
    .map((c) => {
      const m = aggregate((perClient.get(c.id) ?? []).map(toRaw))
      return { id: c.id, name: c.name, logoUrl: c.logoUrl, spend: m.spend, leads: m.leads, cpl: m.cpl, roas: m.roas }
    })
    .sort((a, b) => b.spend - a.spend)

  return {
    period: { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), days },
    comparison,
    series,
    clients: clientOverviews,
    clientCount: clients.length,
  }
}
