import { test } from 'node:test'
import assert from 'node:assert/strict'
import { aggregate, compare, derive, growth, isFavorable } from './metrics'

test('derive calcula os indicadores corretamente', () => {
  const m = derive({
    spend: 1000,
    impressions: 100_000,
    reach: 80_000,
    clicks: 2_000,
    conversions: 100,
    leads: 80,
    revenue: 5_000,
  })
  assert.equal(m.cpc, 0.5) // 1000 / 2000
  assert.equal(m.cpm, 10) // 1000 / 100000 * 1000
  assert.equal(m.ctr, 2) // 2000 / 100000 * 100
  assert.equal(m.cpl, 12.5) // 1000 / 80
  assert.equal(m.roas, 5) // 5000 / 1000
  assert.equal(m.convRate, 5) // 100 / 2000 * 100
})

test('divisão por zero não quebra', () => {
  const m = derive({ spend: 100, impressions: 0, reach: 0, clicks: 0, conversions: 0, leads: 0, revenue: 0 })
  assert.equal(m.cpc, 0)
  assert.equal(m.roas, 0)
  assert.equal(m.ctr, 0)
})

test('aggregate soma várias linhas antes de derivar', () => {
  const m = aggregate([
    { spend: 500, clicks: 1000, impressions: 50_000, leads: 40 },
    { spend: 500, clicks: 1000, impressions: 50_000, leads: 40 },
  ])
  assert.equal(m.spend, 1000)
  assert.equal(m.cpc, 0.5)
  assert.equal(m.leads, 80)
})

test('growth e direção (favorável)', () => {
  assert.equal(growth(120, 100), 20)
  assert.equal(growth(80, 100), -20)
  assert.equal(growth(10, 0), null) // sem base de comparação
  // ROAS subindo = favorável; CPL subindo = desfavorável
  assert.equal(isFavorable('roas', 15), true)
  assert.equal(isFavorable('cpl', 15), false)
})

test('compare devolve deltas por métrica', () => {
  const cmp = compare(
    [{ spend: 110, leads: 110, clicks: 100, impressions: 1000 }],
    [{ spend: 100, leads: 100, clicks: 100, impressions: 1000 }]
  )
  assert.equal(cmp.current.spend, 110)
  assert.equal(cmp.previous.spend, 100)
  assert.equal(Math.round(cmp.deltas.leads ?? 0), 10)
})
