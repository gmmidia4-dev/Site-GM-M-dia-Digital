'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Target, Bot, Workflow, Users, MessageSquare, BarChart, ArrowRight } from 'lucide-react'

const services = [
  {
    id: 'trafego-pago',
    icon: Target,
    title: 'Gestão de Tráfego Pago',
    description: 'Gerenciamos campanhas de alta performance em Meta Ads, Google Ads, YouTube e TikTok para maximizar seu ROI.',
    features: ['Meta Ads', 'Google Ads', 'YouTube Ads', 'TikTok Ads'],
    gradient: 'from-indigo-500/12 to-indigo-500/3',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    dotColor: 'bg-indigo-400',
    glowColor: 'rgba(99,102,241,0.12)',
    borderHover: 'group-hover:border-indigo-500/30',
  },
  {
    id: 'sdr-ia',
    icon: Bot,
    title: 'SDR com Inteligência Artificial',
    description: 'Qualificação automática de leads 24h/dia com IA que entende, responde e agenda reuniões por você.',
    features: ['Qualificação automática', 'Atendimento 24/7', 'Agendamento automático', 'Follow-up inteligente'],
    gradient: 'from-purple-500/12 to-purple-500/3',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    glowColor: 'rgba(168,85,247,0.12)',
    borderHover: 'group-hover:border-purple-500/30',
  },
  {
    id: 'automacao',
    icon: Workflow,
    title: 'Automação Comercial',
    description: 'Automatize seu processo de vendas do primeiro contato ao fechamento com funis e integrações avançadas.',
    features: ['CRM integrado', 'Funis de vendas', 'Integrações API', 'Relatórios automáticos'],
    gradient: 'from-emerald-500/12 to-emerald-500/3',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    glowColor: 'rgba(16,185,129,0.12)',
    borderHover: 'group-hover:border-emerald-500/30',
  },
  {
    id: 'captacao',
    icon: Users,
    title: 'Captação de Leads',
    description: 'Estratégias avançadas para atrair, capturar e nutrir leads qualificados prontos para comprar.',
    features: ['Landing pages', 'Formulários otimizados', 'Lead magnets', 'Nutrição por email'],
    gradient: 'from-orange-500/12 to-orange-500/3',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    dotColor: 'bg-orange-400',
    glowColor: 'rgba(249,115,22,0.12)',
    borderHover: 'group-hover:border-orange-500/30',
  },
  {
    id: 'whatsapp',
    icon: MessageSquare,
    title: 'WhatsApp Inteligente',
    description: 'Transforme seu WhatsApp em uma máquina de vendas com chatbot, sequências e broadcast segmentado.',
    features: ['Chatbot IA', 'Sequências automáticas', 'Broadcast segmentado', 'API WhatsApp Business'],
    gradient: 'from-green-500/12 to-green-500/3',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    dotColor: 'bg-green-400',
    glowColor: 'rgba(34,197,94,0.12)',
    borderHover: 'group-hover:border-green-500/30',
  },
  {
    id: 'crm',
    icon: BarChart,
    title: 'CRM e Vendas',
    description: 'Organize e escale seu time de vendas com pipeline visual, automações e dashboards em tempo real.',
    features: ['Pipeline visual', 'Gestão de propostas', 'Metas e comissões', 'Dashboards BI'],
    gradient: 'from-cyan-500/12 to-cyan-500/3',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    glowColor: 'rgba(6,182,212,0.12)',
    borderHover: 'group-hover:border-cyan-500/30',
  },
]

type Service = typeof services[0]

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({})
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTiltStyle({
      transform: `perspective(1200px) rotateX(${(y - 0.5) * -14}deg) rotateY(${(x - 0.5) * 14}deg) translateZ(16px) scale(1.02)`,
      transition: 'transform 0.08s ease-out',
    })
    setGlarePos({ x: x * 100, y: y * 100, opacity: 0.13 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    })
    setGlarePos({ x: 50, y: 50, opacity: 0 })
  }, [])

  const Icon = service.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.09 }}
      id={service.id}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className={`group relative h-full p-6 lg:p-8 rounded-2xl bg-gradient-to-br ${service.gradient} border border-white/5 ${service.borderHover} cursor-default overflow-hidden transition-[border-color,box-shadow] duration-300`}
      >
        {/* Dynamic glare */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 55%)`,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Top shine line on hover */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 40px ${service.glowColor}` }}
        />

        <div
          className={`relative w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-6 h-6 ${service.iconColor}`} />
        </div>

        <h3 className="relative text-white font-bold text-lg mb-3">{service.title}</h3>
        <p className="relative text-gray-400 text-sm leading-relaxed mb-5">{service.description}</p>

        <ul className="relative space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${service.dotColor}`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      <div className="absolute inset-0 grid-pattern-fine opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">O Que Fazemos</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
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
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 group"
          >
            Ver todos os serviços
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
