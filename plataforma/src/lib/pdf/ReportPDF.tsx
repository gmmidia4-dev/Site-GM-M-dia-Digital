import React from 'react'
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'
import type { ReportData } from '@/lib/types'
import type { ReportInsights } from '@/lib/ai/analyze'
import { METRIC_LABELS, type MetricKey } from '@/lib/metrics'

function brl(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}
function num(v: number) {
  return new Intl.NumberFormat('pt-BR').format(Math.round(v || 0))
}

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: '#1f2937', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #e5e7eb' },
  logo: { width: 120, height: 36, objectFit: 'contain' },
  agency: { fontSize: 9, color: '#6b7280' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  subtitle: { fontSize: 10, color: '#6b7280', marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 14, marginBottom: 8 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kpiCard: { width: '31.5%', padding: 10, borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 8 },
  kpiLabel: { fontSize: 8, color: '#6b7280', marginBottom: 3 },
  kpiValue: { fontSize: 14, fontWeight: 'bold' },
  kpiDelta: { fontSize: 8, marginTop: 2 },
  row: { flexDirection: 'row', borderBottom: '1px solid #f1f5f9', paddingVertical: 4 },
  th: { fontSize: 8, color: '#6b7280', fontWeight: 'bold' },
  cell: { fontSize: 9 },
  paragraph: { fontSize: 9.5, lineHeight: 1.5, color: '#374151', marginBottom: 6 },
  bullet: { fontSize: 9.5, lineHeight: 1.5, color: '#374151', marginBottom: 3 },
  footer: { position: 'absolute', bottom: 24, left: 36, right: 36, fontSize: 8, color: '#9ca3af', textAlign: 'center', borderTop: '1px solid #e5e7eb', paddingTop: 8 },
})

const KPI_KEYS: MetricKey[] = ['spend', 'leads', 'cpl', 'roas', 'clicks', 'ctr', 'conversions', 'cpc', 'revenue']

function formatKpi(key: MetricKey, value: number): string {
  if (['spend', 'revenue', 'cpc', 'cpm', 'cpl', 'cpa'].includes(key)) return brl(value)
  if (['ctr', 'convRate'].includes(key)) return `${value.toFixed(2)}%`
  if (key === 'roas') return value.toFixed(2)
  return num(value)
}

export function ReportPDF({ data, insights }: { data: ReportData; insights?: ReportInsights }) {
  const { current, deltas } = data.comparison
  const primary = data.branding.primary

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.agency}>{data.branding.agencyName}</Text>
            <Text style={{ fontSize: 8, color: '#9ca3af' }}>Relatório de Tráfego Pago</Text>
          </View>
          {data.branding.logoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={data.branding.logoUrl} style={styles.logo} />
          ) : (
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: primary }}>{data.client.name}</Text>
          )}
        </View>

        <Text style={[styles.title, { color: primary }]}>{data.client.name}</Text>
        <Text style={styles.subtitle}>{data.period.label}</Text>

        <Text style={styles.sectionTitle}>Indicadores principais</Text>
        <View style={styles.kpiGrid}>
          {KPI_KEYS.map((key) => {
            const delta = deltas[key]
            return (
              <View key={key} style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>{METRIC_LABELS[key]}</Text>
                <Text style={styles.kpiValue}>{formatKpi(key, current[key])}</Text>
                <Text style={[styles.kpiDelta, { color: (delta ?? 0) >= 0 ? '#059669' : '#dc2626' }]}>
                  {delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}% vs. anterior`}
                </Text>
              </View>
            )
          })}
        </View>

        <Text style={styles.sectionTitle}>Desempenho por plataforma</Text>
        <View style={styles.row}>
          <Text style={[styles.th, { width: '34%' }]}>Plataforma</Text>
          <Text style={[styles.th, { width: '22%' }]}>Investimento</Text>
          <Text style={[styles.th, { width: '14%' }]}>Leads</Text>
          <Text style={[styles.th, { width: '15%' }]}>CPL</Text>
          <Text style={[styles.th, { width: '15%' }]}>ROAS</Text>
        </View>
        {data.platforms.map((p) => (
          <View key={p.platform} style={styles.row}>
            <Text style={[styles.cell, { width: '34%' }]}>{p.label}</Text>
            <Text style={[styles.cell, { width: '22%' }]}>{brl(p.metrics.spend)}</Text>
            <Text style={[styles.cell, { width: '14%' }]}>{num(p.metrics.leads)}</Text>
            <Text style={[styles.cell, { width: '15%' }]}>{brl(p.metrics.cpl)}</Text>
            <Text style={[styles.cell, { width: '15%' }]}>{p.metrics.roas.toFixed(2)}</Text>
          </View>
        ))}

        {insights && (
          <>
            <Text style={styles.sectionTitle}>Resumo executivo</Text>
            <Text style={styles.paragraph}>{insights.executiveSummary}</Text>
            <Text style={styles.paragraph}>{insights.performanceAnalysis}</Text>
            <Text style={styles.sectionTitle}>Análise de crescimento</Text>
            <Text style={styles.paragraph}>{insights.growthExplanation}</Text>
            <Text style={styles.sectionTitle}>Recomendações</Text>
            {insights.optimizations.map((o, i) => (
              <Text key={i} style={styles.bullet}>• {o}</Text>
            ))}
          </>
        )}

        <Text style={styles.footer} fixed>
          {data.branding.agencyName} · Relatório gerado por Reportia · {new Date().toLocaleDateString('pt-BR')}
        </Text>
      </Page>
    </Document>
  )
}
