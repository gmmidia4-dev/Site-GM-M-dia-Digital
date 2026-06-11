'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Star, TrendingUp, Users, BarChart3 } from 'lucide-react'

const floatingCards = [
  {
    id: 1,
    icon: TrendingUp,
    label: 'ROI Médio',
    value: '+340%',
    color: 'from-indigo-500/20 to-purple-500/10',
    border: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    position: 'top-20 right-8 lg:right-20',
  },
  {
    id: 2,
    icon: Users,
    label: 'Clientes Ativos',
    value: '150+',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    position: 'bottom-32 right-4 lg:right-16',
  },
  {
    id: 3,
    icon: BarChart3,
    label: 'Gerenciado',
    value: 'R$50M+',
    color: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    position: 'top-40 left-4 lg:left-16',
  },
]

export function Hero() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de solicitar um diagnóstico gratuito.')}`

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0F0F]">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-[100px] pointer-events-none" />

      {/* Floating stats cards */}
      {floatingCards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + card.id * 0.2, duration: 0.5 }}
            className={`absolute ${card.position} hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-sm shadow-xl z-10`}
          >
            <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${card.iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{card.label}</p>
              <p className="text-sm font-bold text-white">{card.value}</p>
            </div>
          </motion.div>
        )
      })}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-sm text-indigo-300 font-medium">Agência #1 em Resultados com IA</span>
          <div className="flex items-center gap-0.5 ml-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-indigo-400 text-indigo-400" />
            ))}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6"
        >
          Transformamos
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
            Tráfego em Vendas
          </span>
          com Inteligência Artificial
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Combinamos <span className="text-indigo-400 font-semibold">Tráfego Pago</span>,{' '}
          <span className="text-purple-400 font-semibold">SDR com IA</span> e{' '}
          <span className="text-emerald-400 font-semibold">Automação Comercial</span> para
          escalar as vendas do seu negócio em até 340%.
        </motion.p>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-6 mb-10 text-sm text-gray-500"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            150+ clientes ativos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            5 anos de experiência
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            R$50M+ gerenciados
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/contato"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 w-full sm:w-auto justify-center"
          >
            Solicitar Diagnóstico Gratuito
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar no WhatsApp
          </a>
        </motion.div>

        {/* Trusted logos placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">
            Plataformas que dominamos
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['Meta Ads', 'Google Ads', 'TikTok Ads', 'YouTube Ads', 'LinkedIn Ads'].map((platform) => (
              <span
                key={platform}
                className="text-sm text-gray-600 font-semibold hover:text-gray-400 transition-colors duration-200 cursor-default"
              >
                {platform}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-indigo-500"
          />
        </div>
      </motion.div>
    </section>
  )
}
