'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, TrendingUp, Users, BarChart3, Zap, Eye } from 'lucide-react'

const floatingCards = [
  {
    id: 1,
    icon: TrendingUp,
    label: 'ROI Médio',
    value: '+340%',
    color: 'from-indigo-500/25 to-purple-500/10',
    border: 'border-indigo-500/40',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15',
    glowColor: 'rgba(99,102,241,0.15)',
    position: 'top-24 right-8 lg:right-24',
    delay: 1.1,
  },
  {
    id: 2,
    icon: Users,
    label: 'Clientes Ativos',
    value: '150+',
    color: 'from-emerald-500/25 to-teal-500/10',
    border: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    glowColor: 'rgba(16,185,129,0.15)',
    position: 'bottom-36 right-4 lg:right-20',
    delay: 1.3,
  },
  {
    id: 3,
    icon: BarChart3,
    label: 'Gerenciado',
    value: 'R$50M+',
    color: 'from-purple-500/25 to-pink-500/10',
    border: 'border-purple-500/40',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/15',
    glowColor: 'rgba(168,85,247,0.15)',
    position: 'top-44 left-4 lg:left-24',
    delay: 1.5,
  },
]

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; opacity: number }
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.35 + 0.08,
    }))

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99,102,241,${p.opacity})`
        ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(99,102,241,${0.07 * (1 - dist / 110)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
}

export function Hero() {
  const [liveVisitors, setLiveVisitors] = useState(1247)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de solicitar um diagnóstico gratuito.')}`

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(v => v + Math.floor(Math.random() * 4))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Particle network */}
      <ParticleCanvas />

      {/* Grid */}
      <div className="absolute inset-0 grid-pattern" />

      {/* 3D perspective floor */}
      <div className="absolute bottom-0 left-0 right-0 h-64 perspective-floor" />

      {/* Animated orbs */}
      <div
        className="absolute top-1/4 right-1/3 w-[700px] h-[700px] rounded-full pointer-events-none animate-float-slow"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none animate-float-slower"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[200px] rounded-full pointer-events-none animate-blob-pulse"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      {/* Floating stat cards */}
      {floatingCards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: card.delay, duration: 0.7, type: 'spring', stiffness: 120 }}
            whileHover={{ scale: 1.06, y: -5 }}
            className={`absolute ${card.position} hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-md z-10 cursor-default animate-float-card shine-border`}
            style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${card.glowColor}` }}
          >
            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-none mb-0.5">{card.label}</p>
              <p className="text-sm font-black text-white">{card.value}</p>
            </div>
          </motion.div>
        )
      })}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-20">
        {/* Live visitors */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5 text-xs text-emerald-300 font-medium"
        >
          <Eye className="w-3 h-3" />
          <span className="tabular-nums">{liveVisitors.toLocaleString('pt-BR')}</span>
          <span className="text-emerald-400/80">visitantes agora</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
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
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl sm:text-6xl lg:text-[5rem] font-black text-white leading-[1.05] tracking-tight mb-6"
        >
          Transformamos
          <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient mt-1">
            Tráfego em Vendas
          </span>
          <span className="block text-white/60 text-4xl sm:text-5xl lg:text-6xl font-bold mt-2">
            com Inteligência Artificial
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-5 leading-relaxed"
        >
          Combinamos{' '}
          <span className="text-indigo-300 font-semibold">Tráfego Pago</span>,{' '}
          <span className="text-purple-300 font-semibold">SDR com IA</span> e{' '}
          <span className="text-emerald-300 font-semibold">Automação Comercial</span>{' '}
          para escalar as vendas do seu negócio em até 340%.
        </motion.p>

        {/* Social proof dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="flex items-center justify-center gap-6 mb-10 text-sm text-gray-500 flex-wrap"
        >
          {[
            { dot: 'bg-emerald-400', text: '150+ clientes ativos' },
            { dot: 'bg-indigo-400', text: '5 anos de experiência' },
            { dot: 'bg-purple-400', text: 'R$50M+ gerenciados' },
          ].map(({ dot, text }) => (
            <span key={text} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
              {text}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/contato"
            className="group relative flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_50px_rgba(99,102,241,0.45)] hover:scale-[1.03] w-full sm:w-auto justify-center overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            Solicitar Diagnóstico Gratuito
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 w-full sm:w-auto justify-center backdrop-blur-sm shine-border"
          >
            <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
        </motion.div>

        {/* Platforms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">Plataformas que dominamos</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['Meta Ads', 'Google Ads', 'TikTok Ads', 'YouTube Ads', 'LinkedIn Ads'].map((platform, i) => (
              <motion.span
                key={platform}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.06 }}
                className="text-sm text-gray-600 font-semibold hover:text-gray-300 transition-colors duration-300 cursor-default"
              >
                {platform}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-indigo-500"
          />
        </div>
      </motion.div>
    </section>
  )
}
