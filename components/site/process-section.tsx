'use client'

import { motion } from 'framer-motion'
import { Search, Lightbulb, Rocket, BarChart2 } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Diagnóstico Profundo',
    description:
      'Analisamos seu negócio, mercado, concorrência e oportunidades. Mapeamos o potencial de escala e identificamos gargalos no funil de vendas.',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    step: '02',
    icon: Lightbulb,
    title: 'Estratégia Personalizada',
    description:
      'Desenvolvemos um plano de ação sob medida com metas claras, KPIs definidos e cronograma de implementação das soluções ideais para seu negócio.',
    color: 'from-purple-500 to-pink-600',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Execução e Implementação',
    description:
      'Nossa equipe coloca em prática todo o planejamento — desde as campanhas de tráfego até a automação comercial e integração com CRM.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    step: '04',
    icon: BarChart2,
    title: 'Otimização Contínua',
    description:
      'Acompanhamento semanal, relatórios detalhados e otimizações constantes baseadas em dados para garantir crescimento sustentável e previsível.',
    color: 'from-orange-500 to-red-600',
  },
]

export function ProcessSection() {
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            Como Trabalhamos
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 mb-4">
            Do diagnóstico ao{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              resultado em 30 dias
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Metodologia testada e aprovada por mais de 150 empresas que
            alcançaram resultados expressivos com nossa parceria.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-2xl`}>
                    <Icon className="w-7 h-7 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-xs font-black text-gray-300">
                      {step.step}
                    </span>
                  </div>
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
