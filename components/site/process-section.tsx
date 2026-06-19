'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Lightbulb, Rocket, BarChart2 } from 'lucide-react'

const steps = [
  { step: '01', icon: Search, title: 'Diagnóstico Profundo', description: 'Analisamos seu negócio, mercado, concorrência e oportunidades. Mapeamos o potencial de escala e identificamos gargalos no funil de vendas.', color: 'from-indigo-500 to-purple-600', glow: 'rgba(99,102,241,0.4)' },
  { step: '02', icon: Lightbulb, title: 'Estratégia Personalizada', description: 'Desenvolvemos um plano de ação sob medida com metas claras, KPIs definidos e cronograma de implementação das soluções ideais para seu negócio.', color: 'from-purple-500 to-pink-600', glow: 'rgba(168,85,247,0.4)' },
  { step: '03', icon: Rocket, title: 'Execução e Implementação', description: 'Nossa equipe coloca em prática todo o planejamento — desde as campanhas de tráfego até a automação comercial e integração com CRM.', color: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.4)' },
  { step: '04', icon: BarChart2, title: 'Otimização Contínua', description: 'Acompanhamento semanal, relatórios detalhados e otimizações constantes baseadas em dados para garantir crescimento sustentável e previsível.', color: 'from-orange-500 to-red-600', glow: 'rgba(249,115,22,0.4)' },
]

export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section ref={ref} className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute inset-0 grid-pattern-fine opacity-40" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Como Trabalhamos</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Do diagnóstico ao{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">resultado em 30 dias</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Metodologia testada e aprovada por mais de 150 empresas que alcançaram resultados expressivos com nossa parceria.</p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-white/5 overflow-hidden">
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }} style={{ originX: 0 }} className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -8 }} className="group relative flex flex-col items-center text-center">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }} className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 z-10`} style={{ boxShadow: `0 10px 40px ${step.glow}` }}>
                    <Icon className="w-7 h-7 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-xs font-black text-gray-300">{step.step}</span>
                    <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `0 0 50px ${step.glow}` }} />
                  </motion.div>
                  <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
