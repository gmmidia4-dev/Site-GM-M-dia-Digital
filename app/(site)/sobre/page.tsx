import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CTASection } from '@/components/site/cta-section'
import { CheckCircle2, Target, Heart, Zap, Users, Award, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description:
    'Conheça a GM Mídia Digital — agência de marketing especializada em Tráfego Pago, SDR IA e Automação Comercial com +5 anos de experiência e 150+ clientes ativos.',
}

const values = [
  {
    icon: Target,
    title: 'Foco em Resultados',
    description: 'Cada estratégia é orientada por dados e métricas concretas. ROI não é promessa — é meta.',
  },
  {
    icon: Heart,
    title: 'Parceria Real',
    description: 'Tratamos o negócio do cliente como se fosse nosso. Sucesso compartilhado é o modelo que acreditamos.',
  },
  {
    icon: Zap,
    title: 'Inovação Constante',
    description: 'Estamos sempre um passo à frente — testando novas ferramentas, plataformas e abordagens de IA.',
  },
  {
    icon: Users,
    title: 'Equipe Especializada',
    description: 'Profissionais certificados nas principais plataformas de mídia paga e automação do mercado.',
  },
]

const milestones = [
  { year: '2019', title: 'Fundação da agência', description: 'Começamos com foco exclusivo em Meta Ads e Google Ads para pequenas empresas.' },
  { year: '2020', title: 'Expansão de serviços', description: 'Incorporamos automação de WhatsApp e CRM, triplicando nosso portfólio de soluções.' },
  { year: '2021', title: '50 clientes ativos', description: 'Alcançamos a marca de 50 clientes simultâneos gerando resultados consistentes.' },
  { year: '2022', title: 'SDR com IA', description: 'Desenvolvemos nossa metodologia proprietária de SDR com Inteligência Artificial.' },
  { year: '2023', title: 'R$50M gerenciados', description: 'Superamos R$50 milhões em investimentos em tráfego pago gerenciados para clientes.' },
  { year: '2024', title: '150+ clientes', description: 'Hoje somos parceiros de mais de 150 empresas, do pequeno negócio ao enterprise.' },
]

const differentials = [
  'Relatórios semanais com dados reais e transparência total',
  'Acesso direto ao time responsável pela sua conta',
  'Estratégias exclusivas para o seu segmento e mercado',
  'Tecnologia proprietária de qualificação de leads com IA',
  'Integração nativa com os principais CRMs do mercado',
  'SLA de resposta em até 4 horas úteis garantido em contrato',
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Quem Somos</span>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Mais que uma agência —{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              somos parceiros de crescimento
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A GM Mídia Digital nasceu com uma missão clara: usar tecnologia e dados para transformar
            o tráfego digital em vendas reais e previsíveis para nossos clientes.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Nossa Missão</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Democratizar o acesso a estratégias de marketing de alto nível
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Acreditamos que toda empresa, independente do tamanho, merece ter acesso
                às mesmas estratégias e tecnologias que as grandes corporações utilizam
                para escalar vendas.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Por isso, combinamos a expertise humana do nosso time com o poder da
                Inteligência Artificial para criar soluções personalizadas que geram
                resultados consistentes e mensuráveis.
              </p>
              <div className="flex flex-col gap-3">
                {differentials.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '150+', label: 'Clientes Ativos', color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/20' },
                { value: 'R$50M+', label: 'Tráfego Gerenciado', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20' },
                { value: '340%', label: 'ROI Médio', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
                { value: '5 anos', label: 'De Experiência', color: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/20' },
              ].map((stat) => (
                <div key={stat.label} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} text-center`}>
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Nossos Valores</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">O que nos guia todos os dias</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="p-6 rounded-2xl bg-[#111111] border border-white/5 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">Nossa Jornada</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">5 anos construindo resultados</h2>
          </div>
          <div className="relative space-y-0">
            <div className="absolute left-[19px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />
            {milestones.map((item, i) => (
              <div key={item.year} className={`relative flex gap-8 pb-12 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center z-10 sm:mx-auto shadow-lg">
                  <span className="text-white text-xs font-black">{item.year.slice(2)}</span>
                </div>
                <div className={`flex-1 pb-4 ${i % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'}`}>
                  <span className="text-indigo-400 text-sm font-bold">{item.year}</span>
                  <h3 className="text-white font-bold text-lg mt-1 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
