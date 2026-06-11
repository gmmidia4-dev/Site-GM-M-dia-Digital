'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Target,
  Bot,
  Workflow,
  Users,
  MessageSquare,
  BarChart,
  ArrowRight,
} from 'lucide-react'

const services = [
  {
    id: 'trafego-pago',
    icon: Target,
    title: 'Gestão de Tráfego Pago',
    description:
      'Gerenciamos campanhas de alta performance em Meta Ads, Google Ads, YouTube e TikTok para maximizar seu ROI.',
    features: ['Meta Ads', 'Google Ads', 'YouTube Ads', 'TikTok Ads'],
    color: 'from-indigo-500/15 to-indigo-500/5',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/40',
  },
  {
    id: 'sdr-ia',
    icon: Bot,
    title: 'SDR com Inteligência Artificial',
    description:
      'Qualificação automática de leads 24h/dia com IA que entende, responde e agenda reuniões por você.',
    features: ['Qualificação automática', 'Atendimento 24/7', 'Agendamento automático', 'Follow-up inteligente'],
    color: 'from-purple-500/15 to-purple-500/5',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/40',
  },
  {
    id: 'automacao',
    icon: Workflow,
    title: 'Automação Comercial',
    description:
      'Automatize seu processo de vendas do primeiro contato ao fechamento com funis e integrações avançadas.',
    features: ['CRM integrado', 'Funis de vendas', 'Integrações API', 'Relatórios automáticos'],
    color: 'from-emerald-500/15 to-emerald-500/5',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/40',
  },
  {
    id: 'captacao',
    icon: Users,
    title: 'Captação de Leads',
    description:
      'Estratégias avançadas para atrair, capturar e nutrir leads qualificados prontos para comprar.',
    features: ['Landing pages', 'Formulários otimizados', 'Lead magnets', 'Nutrição por email'],
    color: 'from-orange-500/15 to-orange-500/5',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'hover:border-orange-500/40',
  },
  {
    id: 'whatsapp',
    icon: MessageSquare,
    title: 'WhatsApp Inteligente',
    description:
      'Transforme seu WhatsApp em uma máquina de vendas com chatbot, sequências e broadcast segmentado.',
    features: ['Chatbot IA', 'Sequências automáticas', 'Broadcast segmentado', 'API WhatsApp Business'],
    color: 'from-green-500/15 to-green-500/5',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    borderColor: 'hover:border-green-500/40',
  },
  {
    id: 'crm',
    icon: BarChart,
    title: 'CRM e Vendas',
    description:
      'Organize e escale seu time de vendas com pipeline visual, automações e dashboards em tempo real.',
    features: ['Pipeline visual', 'Gestão de propostas', 'Metas e comissões', 'Dashboards BI'],
    color: 'from-cyan-500/15 to-cyan-500/5',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/40',
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            O Que Fazemos
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 mb-4">
            Soluções completas para{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              escalar vendas
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Do tráfego pago à automação inteligente — tudo integrado para transformar
            visitantes em clientes de alto valor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                id={service.id}
              >
                <div
                  className={`group h-full p-6 lg:p-8 rounded-2xl bg-gradient-to-br ${service.color} border border-white/5 ${service.borderColor} transition-all duration-300 hover:shadow-2xl cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${service.iconColor}`} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${service.iconColor.replace('text-', 'bg-')}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
          >
            Ver todos os serviços
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
