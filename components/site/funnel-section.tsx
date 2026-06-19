'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Eye, MousePointerClick, UserCheck, MessageSquareText, Trophy, ArrowDown } from 'lucide-react'

const stages = [
  {
    icon: Eye,
    label: 'Impressões',
    sub: 'Alcance qualificado',
    value: 284000,
    display: '284.000',
    pct: 100,
    width: 100,
    color: '#6366f1',
    color2: '#818cf8',
  },
  {
    icon: MousePointerClick,
    label: 'Cliques',
    sub: 'Tráfego engajado',
    value: 18400,
    display: '18.400',
    pct: 6.5,
    width: 80,
    color: '#8b5cf6',
    color2: '#a78bfa',
  },
  {
    icon: UserCheck,
    label: 'Leads',
    sub: 'Contatos capturados',
    value: 3200,
    display: '3.200',
    pct: 1.1,
    width: 60,
    color: '#a855f7',
    color2: '#c084fc',
  },
  {
    icon: MessageSquareText,
    label: 'Qualificados',
    sub: 'SDR com IA 24/7',
    value: 1480,
    display: '1.480',
    pct: 0.52,
    width: 42,
    color: '#d946ef',
    color2: '#e879f9',
  },
  {
    icon: Trophy,
    label: 'Vendas',
    sub: 'Receita gerada',
    value: 847,
    display: '847',
    pct: 0.3,
    width: 26,
    color: '#10b981',
    color2: '#34d399',
  },
]

function FlowParticles() {
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

    type P = { x: number; y: number; vy: number; r: number; o: number; hue: number }
    const particles: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vy: Math.random() * 0.8 + 0.4,
      r: Math.random() * 1.6 + 0.5,
      o: Math.random() * 0.5 + 0.2,
      hue: 250 + Math.random() * 60,
    }))

    let id: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      for (const p of particles) {
        p.y += p.vy
        // funnel toward center as it descends
        const progress = p.y / canvas.height
        const pull = (cx - p.x) * 0.004 * progress
        p.x += pull
        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.o})`
        ctx.fill()
      }
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(id)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70" />
}

function CountUp({ value, started, duration = 2 }: { value: number; started: boolean; duration?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const step = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / (duration * 1000), 1)
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, value, duration])
  return <span className="tabular-nums">{n.toLocaleString('pt-BR')}</span>
}

export function FunnelSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActive] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-28 bg-[#070707] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute inset-0 grid-pattern-fine opacity-30" />
      <FlowParticles />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none animate-blob-pulse"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)', filter: 'blur(70px)' }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300 font-medium">Funil de Conversão Inteligente</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 leading-[1.05]">
            Cada clique vira{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
              receita previsível
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Veja a jornada completa: do primeiro anúncio à venda fechada. Cada etapa
            otimizada por IA para extrair o máximo de cada real investido.
          </p>
        </motion.div>

        {/* Funnel */}
        <div className="flex flex-col items-center gap-3" style={{ perspective: '1400px' }}>
          {stages.map((stage, i) => {
            const Icon = stage.icon
            const isActive = active === i
            return (
              <div key={stage.label} className="w-full flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: -25 }}
                  animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ delay: i * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    width: `${stage.width}%`,
                    transformStyle: 'preserve-3d',
                    transform: isActive ? 'translateZ(30px) scale(1.03)' : 'translateZ(0) scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                    background: `linear-gradient(135deg, ${stage.color}22, ${stage.color2}0a)`,
                    borderColor: isActive ? `${stage.color}80` : `${stage.color}30`,
                    boxShadow: isActive
                      ? `0 20px 60px ${stage.color}40, inset 0 0 30px ${stage.color}20`
                      : `0 10px 30px rgba(0,0,0,0.4)`,
                  }}
                  className="relative min-w-[260px] rounded-2xl border backdrop-blur-md px-6 py-5 cursor-pointer overflow-hidden"
                >
                  {/* shimmer sweep */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div
                      className="absolute top-0 bottom-0 w-1/3 animate-shimmer"
                      style={{ background: `linear-gradient(90deg, transparent, ${stage.color}25, transparent)` }}
                    />
                  </div>

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${stage.color}25`, color: stage.color2 }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm sm:text-base truncate">{stage.label}</p>
                        <p className="text-gray-400 text-xs truncate">{stage.sub}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl sm:text-2xl font-black text-white">
                        <CountUp value={stage.value} started={inView} />
                      </p>
                      <p className="text-[10px] font-semibold" style={{ color: stage.color2 }}>
                        {stage.pct}% taxa
                      </p>
                    </div>
                  </div>
                </motion.div>

                {i < stages.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.18 + 0.3 }}
                    className="my-1"
                  >
                    <ArrowDown className="w-4 h-4 text-white/20 animate-bounce" style={{ animationDuration: '2s' }} />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="mt-14 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          {[
            { label: 'ROAS médio', value: '12x', color: 'from-indigo-400 to-purple-400' },
            { label: 'Custo por venda', value: '-68%', color: 'from-purple-400 to-pink-400' },
            { label: 'Receita gerada', value: 'R$2.4M', color: 'from-emerald-400 to-teal-400' },
          ].map((m) => (
            <div key={m.label} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>
                {m.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
