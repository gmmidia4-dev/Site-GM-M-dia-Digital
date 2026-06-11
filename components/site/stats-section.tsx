'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

const stats = [
  {
    value: 150,
    suffix: '+',
    label: 'Clientes Ativos',
    description: 'Empresas que confiam em nossa gestão',
    color: 'from-indigo-400 to-purple-400',
  },
  {
    value: 50,
    prefix: 'R$',
    suffix: 'M+',
    label: 'Gerenciados em Tráfego',
    description: 'Em investimentos otimizados e rastreados',
    color: 'from-emerald-400 to-teal-400',
  },
  {
    value: 340,
    suffix: '%',
    label: 'ROI Médio Gerado',
    description: 'Retorno sobre investimento dos clientes',
    color: 'from-purple-400 to-pink-400',
  },
  {
    value: 5,
    suffix: ' anos',
    label: 'De Experiência',
    description: 'Construindo resultados sólidos',
    color: 'from-orange-400 to-red-400',
  },
]

function CountUp({
  value,
  duration = 2,
  started,
}: {
  value: number
  duration?: number
  started: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, value, duration])

  return <span>{count}</span>
}

export function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            Nossos Números
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white">
            Resultados que falam por si
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="p-6 lg:p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl text-center">
                <div
                  className={`text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                >
                  {stat.prefix}
                  <CountUp value={stat.value} started={inView} />
                  {stat.suffix}
                </div>
                <h3 className="text-white font-bold text-sm lg:text-base mb-1">{stat.label}</h3>
                <p className="text-gray-500 text-xs lg:text-sm leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
