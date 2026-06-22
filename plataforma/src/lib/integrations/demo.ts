import type { Platform } from '@prisma/client'
import type { DailyInsight } from './types'

/**
 * Gerador de dados sintéticos por plataforma. Determinístico em função do
 * `seed` (ex.: id da integração) para que os números fiquem estáveis entre
 * recarregamentos. Usado quando DEMO_MODE está ligado ou não há credenciais.
 */

// PRNG determinístico (mulberry32)
function rng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Profile {
  dailySpend: [number, number] // faixa de investimento diário
  cpm: [number, number]
  ctr: [number, number] // %
  cvr: [number, number] // conversão sobre cliques (%)
  leadRate: [number, number] // leads sobre conversões (%)
  ticket: [number, number] // ticket médio por conversão (receita)
  campaigns: string[]
}

const PROFILES: Record<Platform, Profile> = {
  META_ADS: {
    dailySpend: [120, 380],
    cpm: [14, 32],
    ctr: [0.9, 2.4],
    cvr: [3, 8],
    leadRate: [60, 95],
    ticket: [180, 420],
    campaigns: ['Conversão | Remarketing', 'Leads | Topo de Funil', 'Tráfego | Lookalike 1%'],
  },
  GOOGLE_ADS: {
    dailySpend: [150, 500],
    cpm: [20, 48],
    ctr: [2.5, 6.0],
    cvr: [4, 10],
    leadRate: [55, 90],
    ticket: [220, 600],
    campaigns: ['Pesquisa | Marca', 'Pesquisa | Genéricas', 'PMax | Conversões'],
  },
  TIKTOK_ADS: {
    dailySpend: [80, 260],
    cpm: [6, 16],
    ctr: [0.6, 1.8],
    cvr: [2, 6],
    leadRate: [50, 85],
    ticket: [120, 300],
    campaigns: ['Spark Ads | Reconhecimento', 'Conversão | Catálogo'],
  },
  LINKEDIN_ADS: {
    dailySpend: [90, 300],
    cpm: [50, 120],
    ctr: [0.4, 1.0],
    cvr: [2, 5],
    leadRate: [70, 98],
    ticket: [800, 2500],
    campaigns: ['Lead Gen | Decisores', 'InMail | ABM'],
  },
  GA4: {
    dailySpend: [0, 0],
    cpm: [0, 0],
    ctr: [0, 0],
    cvr: [0, 0],
    leadRate: [0, 0],
    ticket: [200, 500],
    campaigns: ['Orgânico', 'Direto', 'Referral'],
  },
  SEARCH_CONSOLE: {
    dailySpend: [0, 0],
    cpm: [0, 0],
    ctr: [1, 5],
    cvr: [0, 0],
    leadRate: [0, 0],
    ticket: [0, 0],
    campaigns: ['Busca orgânica'],
  },
}

function lerp(rand: () => number, [min, max]: [number, number]): number {
  return min + rand() * (max - min)
}

function eachDay(start: string, end: string): string[] {
  const days: string[] = []
  const d = new Date(start + 'T00:00:00Z')
  const last = new Date(end + 'T00:00:00Z')
  while (d <= last) {
    days.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return days
}

export function generateDemoInsights(
  platform: Platform,
  seed: string,
  startDate: string,
  endDate: string
): DailyInsight[] {
  const profile = PROFILES[platform]
  const rand = rng(seed + platform)
  const days = eachDay(startDate, endDate)
  const campaigns = profile.campaigns

  const rows: DailyInsight[] = []
  days.forEach((date, idx) => {
    // leve tendência de crescimento + sazonalidade semanal
    const trend = 1 + idx * 0.004
    const weekday = new Date(date).getUTCDay()
    const weekend = weekday === 0 || weekday === 6 ? 0.8 : 1

    campaigns.forEach((campaignName, ci) => {
      const spend = lerp(rand, profile.dailySpend) * trend * weekend * (0.7 + 0.6 * rand())
      const cpm = lerp(rand, profile.cpm)
      const impressions = cpm > 0 ? Math.round((spend / cpm) * 1000) : Math.round(lerp(rand, [4000, 20000]))
      const ctr = lerp(rand, profile.ctr) / 100
      const clicks = Math.round(impressions * ctr)
      const cvr = lerp(rand, profile.cvr) / 100
      const conversions = Math.round(clicks * cvr)
      const leads = Math.round(conversions * (lerp(rand, profile.leadRate) / 100))
      const revenue = conversions * lerp(rand, profile.ticket)
      const reach = Math.round(impressions * (0.55 + 0.3 * rand()))

      rows.push({
        date,
        campaignId: `${platform.toLowerCase()}_${ci}`,
        campaignName,
        spend: Math.round(spend * 100) / 100,
        impressions,
        reach,
        clicks,
        conversions,
        leads,
        revenue: Math.round(revenue * 100) / 100,
      })
    })
  })
  return rows
}
