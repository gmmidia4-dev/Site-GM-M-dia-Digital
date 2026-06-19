'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const stats = [
  {
    value: 150,
    suffix: '+',
    label: 'Clientes Ativos',
    description: 'Empresas que confiam em nossa gestão',
    color: 'from-indigo-400 to-purple-400',
    glow: 'rgba(99,102,241,0.2)',
  },
  {
    value: 50,
    prefix: 'R$',
    suffix: 'M+',
    label: 'Gerenciados em Tráfego',
    description: 'Em investimentos otimizados e rastreados',
    color: 'from-emerald-400 to-teal-400',
    glow: 'rgba(16,185,129,0.2)',
  },
  {
    value: 340,
    suffix: '%',
    label: 'ROI Médio Gerado',
    description: 'Retorno sobre investimento dos clientes',
    color: 'from-purple-400 to-pink-400',
    glow: 'rgba(168,85,247,0.2)',
  },
  {
    value: 5,
    suffix: ' anos',
    label: 'De Experiência',
    description: 'Construindo resultados sólidos',
    color: 'from-orange-400 to-red-400',
    glow: 'rgba(249,115,22,0.2)',
  },
]

const trafficBars = [
  { label: 'Meta Ads', pct: 42, color: 'from-indigo-500 to-purple-500' },
  { label: 'Google Ads', pct: 31, color: 'from-blue-500 to-cyan-400' },
  { label: 'TikTok Ads', pct: 15, color: 'from-pink-500 to-rose-400' },
  { label: 'Orgânico', pct: 8, color: 'from-emerald-500 to-teal-400' },
  { label: 'Outros', pct: 4, color: 'from-orange-400 to-amber-400' },
]

function CountUp({ value, duration = 2, started }: { value: number; duration?: number; started: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, value, duration])
  return <span>{count}</span>
}

export function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true })

  return (
    <section ref={ref} className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Nossos Números</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
            Resultados que falam por si
          </h2>
        </motion.div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div
                className="relative p-6 lg:p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all duration-300 text-center overflow-hidden group"
                style={{ '--glow': stat.glow } as React.CSSProperties}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${stat.glow}, transparent 70%)` }}
                />
                <div className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.prefix}
                  <CountUp value={stat.value} started={inView} />
                  {stat.suffix}
                </div>
                <h3 className="text-white font-bold text-sm lg:text-base mb-1">{stat.label}</h3>
                <p className="text-gray-500 text-xs lg:text-sm leading-relaxed">{stat.description}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Traffic distribution bars */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-6 lg:p-10 rounded-2xl bg-[#111] border border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span className="text-white font-bold text-lg">Distribuição de Tráfego</span>
              </div>
              <p className="text-gray-500 text-sm">Performance por canal — últimos 30 dias</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ao vivo
            </div>
          </div>

          <div className="space-y-5">
            {trafficBars.map((bar, i) => (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300 font-medium">{bar.label}</span>
                  <span className="text-sm font-bold text-white tabular-nums">{bar.pct}%</span>
                </div>
                <div className="relative h-3 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: inView ? `${bar.pct}%` : '0%' }}
                    transition={{ duration: 1.4, delay: 0.4 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.color}`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: inView ? `${bar.pct}%` : '0%' }}
                    transition={{ duration: 1.4, delay: 0.4 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${bar.color} blur-sm opacity-40`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
