'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Zap, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { leadSchema, type LeadInput } from '@/lib/validations'

const services = [
  'Gestão de Tráfego Pago',
  'SDR com IA',
  'Automação Comercial',
  'Captação de Leads',
  'WhatsApp Inteligente',
  'CRM e Vendas',
  'Diagnóstico Completo',
]

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = async (data: LeadInput) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'contact-page' }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar formulário')
      }

      setSubmitted(true)
      reset()
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const whatsappLink = `https://wa.me/5511999999999?text=${encodeURIComponent(
    'Olá! Gostaria de solicitar um diagnóstico gratuito com a GM Mídia Digital.'
  )}`

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            Entre em Contato
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
            Vamos{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              escalar seu negócio?
            </span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Preencha o formulário e nossa equipe entrará em contato em até 2 horas úteis para agendar
            seu diagnóstico gratuito.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-6">Informações de Contato</h2>
                <div className="space-y-5">
                  <a
                    href="mailto:contato@gmmidia.com.br"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-white/5 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                      <Mail className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email</p>
                      <p className="text-white font-medium">contato@gmmidia.com.br</p>
                    </div>
                  </a>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-white/5 hover:border-green-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">WhatsApp</p>
                      <p className="text-white font-medium">+55 (11) 99999-9999</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Localização</p>
                      <p className="text-white font-medium">São Paulo, SP — Brasil</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response time */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-white font-semibold">Tempo de Resposta</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Respondemos todos os contatos em até{' '}
                  <strong className="text-white">2 horas úteis</strong>. Em casos urgentes, envie
                  uma mensagem no WhatsApp.
                </p>
              </div>

              {/* What to expect */}
              <div>
                <h3 className="text-white font-semibold mb-4">O que acontece depois:</h3>
                <div className="space-y-3">
                  {[
                    { step: '01', text: 'Recebemos e analisamos seu contato' },
                    { step: '02', text: 'Nossa equipe entra em contato em até 2h' },
                    { step: '03', text: 'Agendamos uma call de diagnóstico gratuito' },
                    { step: '04', text: 'Apresentamos uma estratégia personalizada' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-400">{item.step}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#22c55e] transition-colors shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp Agora
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="p-8 rounded-2xl bg-[#111111] border border-white/5">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Mensagem enviada!
                    </h3>
                    <p className="text-gray-400 mb-8 leading-relaxed max-w-sm mx-auto">
                      Obrigado pelo seu contato! Nossa equipe entrará em contato em até 2 horas
                      úteis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors"
                      >
                        Enviar outro contato
                      </button>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#22c55e] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Falar no WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Solicitar Diagnóstico Gratuito
                      </h2>
                      <p className="text-gray-400 text-sm mb-6">
                        Preencha os dados abaixo e entraremos em contato em breve.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome"
                          {...register('name')}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-red-400 text-xs">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          {...register('email')}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-xs">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">WhatsApp / Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          {...register('phone')}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-red-400 text-xs">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          placeholder="Nome da sua empresa"
                          {...register('company')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Serviço de interesse</Label>
                      <select
                        id="service"
                        {...register('service')}
                        className="flex h-10 w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-[#E2E8F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
                      >
                        <option value="">Selecione um serviço...</option>
                        {services.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Conte sobre seu negócio</Label>
                      <Textarea
                        id="message"
                        placeholder="Qual é seu principal desafio? Qual resultado você quer alcançar? (opcional)"
                        rows={4}
                        {...register('message')}
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Solicitar Diagnóstico Gratuito
                        </span>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Ao enviar, você concorda com nossa{' '}
                      <a href="/politica-de-privacidade" className="text-indigo-400 hover:underline">
                        Política de Privacidade
                      </a>
                      . Seus dados estão seguros.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
