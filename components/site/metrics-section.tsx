'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, TrendingUp, DollarSign, Clock, ArrowUpRight, Zap, Activity, MousePointerClick } from 'lucide-react'

const sources = [
  { name: 'Meta Ads', pct: 42, color: 'from-indigo-500 to-purple-600' },
  { name: 'Google Ads', pct: 31, color: 'from-blue-500 to-cyan-400' },
  { name: 'TikTok Ads', pct: 15, color: 'from-pink-500 to-rose-500' },
  { name: 'Orgânico', pct: 8, color: 'from-emerald-500 to-teal-400' },
  { name: 'Outros', pct: 4, color: 'from-orange-400 to-amber-400' },
]

const funnelSteps = [
  { label: 'Impressões', value: '284K', pct: 100, color: 'bg-indigo-500/30' },
  { label: 'Cliques', value: '18.4K', pct: 65, color: 'bg-indigo-500/50' },
  { label: 'Leads', value: '3.2K', pct: 38, color: 'bg-purple-500/60' },
  { label: 'Conversões', value: '847', pct: 18, color: 'bg-emerald-500/70' },
]

type MetricCardProps = {
  label: string
  value: string
  delta: string
  positive: boolean
  icon: React.ElementType
  gradientFrom: string
  gradientTo: string
  live?: boolean
}

function MetricCard({ label, value, delta, positive, icon: Icon, gradientFrom, gradientTo, live }: MetricCardProps) {
  return (
    <div className="relative group p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all duration-400 overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${gradientFrom}18, transparent 65%)` }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}15)` }}
        >
          <Icon className="w-5 h-5" style={{ color: gradientFrom }} />
        </div>
        <div className="flex items-center gap-1">
          {live && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          <span
            className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
              positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
            }`}
          >
            <ArrowUpRight className={`w-3 h-3 ${positive ? '' : 'rotate-90'}`} />
            {delta}
          </span>
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-1 tabular-nums">{value}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-50 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${gradientFrom}, transparent)` }}
      />
    </div>
  )
}

export function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, margin: '-80px' })
  const [barsStarted, setBarsStarted] = useState(false)

  const [visitors, setVisitors] = useState(3847)
  const [revenue, setRevenue] = useState(284590)

  useEffect(() => {
    if (!isInView) return
    setBarsStarted(true)
    const t = setInterval(() => {
      setVisitors(v => v + Math.floor(Math.random() * 5 + 1))
      setRevenue(r => r + Math.floor(Math.random() * 300 + 80))
    }, 2000)
    return () => clearInterval(t)
  }, [isInView])

  const metrics: MetricCardProps[] = [
    {
      label: 'Visitantes únicos hoje',
      value: visitors.toLocaleString('pt-BR'),
      delta: '+12%',
      positive: true,
      icon: Users,
      gradientFrom: '#6366f1',
      gradientTo: '#a855f7',
      live: true,
    },
    {
      label: 'Taxa de conversão',
      value: '4,2%',
      delta: '+0.8%',
      positive: true,
      icon: MousePointerClick,
      gradientFrom: '#10b981',
      gradientTo: '#14b8a6',
    },
    {
      label: 'Receita gerada (mês)',
      value: `R$${(revenue / 1000).toFixed(1)}K`,
      delta: '+23%',
      positive: true,
      icon: DollarSign,
      gradientFrom: '#a855f7',
      gradientTo: '#ec4899',
      live: true,
    },
    {
      label: 'Tempo médio de sessão',
      value: '3m 45s',
      delta: '+15s',
      positive: true,
      icon: Clock,
      gradientFrom: '#f97316',
      gradientTo: '#f59e0b',
    },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-[#080808] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />
      <div className="absolute inset-0 grid-pattern-fine opacity-40" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-300 font-medium">Dashboard ao Vivo</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Métricas que{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              convertem
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Seus clientes acompanham resultados em tempo real. Veja como a IA transforma
            dados em decisões que geram vendas todos os dias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left — metrics 2x2 + waveform */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <MetricCard {...m} />
                </motion.div>
              ))}
            </div>

            {/* Waveform / activity bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="p-5 rounded-2xl bg-[#111] border border-white/5 flex items-center gap-5"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-sm text-gray-400 whitespace-nowrap">Atividade em tempo real</span>
              </div>
              <div className="flex items-end gap-px flex-1 h-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.2 + Math.random() * 0.3, 0.7 + Math.random() * 0.3, 0.2 + Math.random() * 0.3] }}
                    transition={{ duration: 1.2 + Math.random() * 0.8, repeat: Infinity, delay: i * 0.04 }}
                    className="flex-1 rounded-sm origin-bottom"
                    style={{ background: `rgba(99,102,241,${0.15 + (i % 5) * 0.08})`, height: '100%' }}
                  />
                ))}
              </div>
              <div className="text-xs text-emerald-400 font-bold whitespace-nowrap bg-emerald-500/10 px-2 py-1 rounded-full">
                +{Math.floor(Math.random() * 40 + 20)}/min
              </div>
            </motion.div>
          </div>

          {/* Right — funnel + traffic sources */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            {/* Conversion funnel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-[#111] border border-white/5"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-bold">Funil de Conversão</span>
              </div>
              <div className="space-y-3">
                {funnelSteps.map((step, i) => (
                  <div key={step.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">{step.label}</span>
                      <span className="text-white font-bold tabular-nums">{step.value}</span>
                    </div>
                    <div className="relative h-6 rounded-lg bg-white/[0.03] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: barsStarted ? `${step.pct}%` : '0%' }}
                        transition={{ duration: 1.3, delay: 0.3 + i * 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute inset-y-0 left-0 rounded-lg ${step.color} flex items-center justify-end pr-2`}
                      >
                        <span className="text-[10px] font-bold text-white/80">{step.pct}%</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Traffic sources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28 }}
              className="p-6 rounded-2xl bg-[#111] border border-white/5 flex-1"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold">Fontes de Tráfego</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">30 dias</span>
              </div>
              <div className="space-y-4">
                {sources.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">{s.name}</span>
                      <span className="font-bold text-white">{s.pct}%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: barsStarted ? `${s.pct}%` : '0%' }}
                        transition={{ duration: 1.3, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${s.color}`}
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: barsStarted ? `${s.pct}%` : '0%' }}
                        transition={{ duration: 1.3, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${s.color} blur-sm opacity-50`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
