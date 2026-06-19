'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Ricardo Almeida',
    role: 'CEO',
    company: 'Grupo Almeida Imóveis',
    content:
      'Em 4 meses com a GM Mídia Digital, nossas reuniões com compradores qualificados aumentaram 85%. A automação com WhatsApp e o CRM transformaram completamente nosso processo comercial. Hoje vendemos 3x mais com o mesmo time.',
    rating: 5,
    initials: 'RA',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 2,
    name: 'Fernanda Costa',
    role: 'Diretora de Marketing',
    company: 'Clínica Estética Belle',
    content:
      'Tínhamos muito tráfego mas poucos leads qualificados. A GM Mídia reestruturou nossas campanhas e implantou um SDR com IA que qualifica os pacientes 24h. Nosso faturamento cresceu 210% em 5 meses. Recomendo muito!',
    rating: 5,
    initials: 'FC',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 3,
    name: 'Bruno Mendonça',
    role: 'Sócio-fundador',
    company: 'TechVenda Software',
    content:
      'A expertise deles em tráfego pago para B2B é diferenciada. Conseguiram reduzir nosso CPL em 68% e aumentar a qualidade dos leads em 3x. O acompanhamento semanal e os relatórios detalhados nos dão total transparência.',
    rating: 5,
    initials: 'BM',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 4,
    name: 'Juliana Ramos',
    role: 'Proprietária',
    company: 'Boutique Donna Juliana',
    content:
      'Minha loja online passou de R$30K para R$380K por mês em apenas 6 meses! A estratégia deles de Meta Ads com segmentação precisa e o remarketing inteligente fizeram toda a diferença. Investimento que se paga muito rápido.',
    rating: 5,
    initials: 'JR',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 5,
    name: 'Carlos Eduardo',
    role: 'Diretor Comercial',
    company: 'Construtora Terraforte',
    content:
      'A GM Mídia Digital entregou exatamente o que prometeu. Em 90 dias nosso pipeline de obras passou de 12 para 47 oportunidades ativas. A automação comercial deles é impressionante — parece mágica mas é pura tecnologia.',
    rating: 5,
    initials: 'CE',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 6,
    name: 'Amanda Silva',
    role: 'Founder',
    company: 'Studio AS Arquitetura',
    content:
      'Nunca imaginei que com R$3K de investimento em tráfego pago conseguiria fechar projetos de R$80K. A capacidade deles de segmentar o público certo e criar anúncios que convertem é impressionante. Parceria de longo prazo!',
    rating: 5,
    initials: 'AS',
    color: 'from-violet-500 to-purple-600',
  },
]

type Testimonial = typeof testimonials[0]

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="w-[340px] sm:w-[400px] shrink-0">
      <div className="h-full p-6 lg:p-7 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col shine-border">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1">
            {[...Array(item.rating)].map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <Quote className="w-5 h-5 text-indigo-500/40" />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">&ldquo;{item.content}&rdquo;</p>
        <div className="flex items-center gap-3 pt-5 border-t border-white/5">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {item.initials}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{item.name}</p>
            <p className="text-gray-500 text-xs">{item.role} · {item.company}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Marquee({ items, reverse = false, duration = 40 }: { items: Testimonial[]; reverse?: boolean; duration?: number }) {
  const doubled = [...items, ...items]
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            Depoimentos
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            O que nossos clientes{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              dizem sobre nós
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-300 font-semibold">5.0</span>
            <span className="text-gray-500">· +150 avaliações</span>
          </div>
        </motion.div>

        {/* Two moving rows with edge fade */}
        <div className="relative space-y-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-[#0F0F0F] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-[#0F0F0F] to-transparent" />
          <Marquee items={testimonials.slice(0, 3)} duration={38} />
          <Marquee items={testimonials.slice(3, 6)} reverse duration={44} />
        </div>
      </div>
    </section>
  )
}
