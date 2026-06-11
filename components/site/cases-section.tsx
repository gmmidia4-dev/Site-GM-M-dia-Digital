'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'

const cases = [
  {
    slug: 'ecommerce-moda-340-roas',
    client: 'Loja de Moda Premium',
    niche: 'E-commerce',
    title: 'De R$30K para R$380K/mês em 6 meses',
    description:
      'Reestruturamos todas as campanhas de Meta Ads e Google Shopping, implementamos SDR com IA para recuperação de carrinhos e automação de remarketing inteligente.',
    results: [
      { label: 'ROAS', value: '12x', color: 'text-indigo-400' },
      { label: 'Faturamento', value: '+1.167%', color: 'text-emerald-400' },
      { label: 'CAC', value: '-68%', color: 'text-purple-400' },
    ],
    tag: 'E-commerce',
    tagColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  },
  {
    slug: 'clínica-odontologica-leads-qualificados',
    client: 'Clínica Odontológica SP',
    niche: 'Saúde',
    title: '340 leads qualificados em 30 dias',
    description:
      'Implementamos campanha de Google Ads + Meta Ads com landing page otimizada e WhatsApp Bot para qualificação automática de pacientes em horário comercial e fora dele.',
    results: [
      { label: 'Leads/mês', value: '340', color: 'text-indigo-400' },
      { label: 'Taxa conv.', value: '28%', color: 'text-emerald-400' },
      { label: 'Custo/lead', value: 'R$18', color: 'text-purple-400' },
    ],
    tag: 'Saúde',
    tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  },
  {
    slug: 'imobiliaria-automacao-crm',
    client: 'Imobiliária Top Imóveis',
    niche: 'Imóveis',
    title: 'CRM + IA: 85% mais reuniões agendadas',
    description:
      'Integramos CRM com IA conversacional para WhatsApp, eliminando o tempo de resposta manual e aumentando drasticamente as reuniões agendadas com compradores qualificados.',
    results: [
      { label: 'Reuniões', value: '+85%', color: 'text-indigo-400' },
      { label: 'Resposta', value: '< 2 min', color: 'text-emerald-400' },
      { label: 'Vendas', value: '+42%', color: 'text-purple-400' },
    ],
    tag: 'Imóveis',
    tagColor: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  },
]

export function CasesSection() {
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-16"
        >
          <div>
            <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
              Cases de Sucesso
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Resultados reais de{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                clientes reais
              </span>
            </h2>
          </div>
          <Link
            href="/cases"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 group shrink-0"
          >
            Ver todos os cases
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group"
            >
              <div className="h-full p-6 lg:p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                  <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors duration-300" />
                </div>

                <p className="text-xs text-gray-500 mb-1">{item.client}</p>
                <h3 className="text-white font-bold text-lg leading-tight mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{item.description}</p>

                {/* Results */}
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/5">
                  {item.results.map((result) => (
                    <div key={result.label} className="text-center">
                      <div className={`text-xl font-black ${result.color}`}>{result.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{result.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
