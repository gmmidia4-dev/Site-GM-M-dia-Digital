'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const benefits = [
  'Diagnóstico completo do seu negócio',
  'Mapeamento de oportunidades de escala',
  'Estratégia personalizada sem custo',
  'Sem compromisso — você decide',
]

export function CTASection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Quero agendar meu diagnóstico gratuito.')}`

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              Vagas limitadas este mês
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
              Pronto para{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                escalar suas vendas
              </span>
              {' '}com IA?
            </h2>
            <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Agende seu diagnóstico gratuito e descubra como transformar seu tráfego
              em uma máquina de vendas previsível.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {benefit}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contato"
              className="group flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 w-full sm:w-auto justify-center"
            >
              Agendar Diagnóstico Gratuito
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-10 py-5 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>

          <p className="text-xs text-gray-600">
            Sem spam. Sem compromisso. Resposta em até 2 horas úteis.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
