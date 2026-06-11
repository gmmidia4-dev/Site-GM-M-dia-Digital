import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp, ArrowRight, BarChart2, Users, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cases de Sucesso',
  description:
    'Conheça os resultados reais dos clientes da GM Mídia Digital. Cases de e-commerce, clínicas, imobiliárias, educação e mais.',
}

const cases = [
  {
    slug: 'ecommerce-moda-premium-380k-mes',
    client: 'Boutique Donna — Moda Premium',
    niche: 'E-commerce',
    nicheColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    title: 'De R$30K para R$380K/mês em 6 meses',
    description:
      'Loja de moda premium que estava investindo mal em Meta Ads sem estratégia. Reestruturamos toda a conta, criamos campanhas segmentadas por persona, implementamos remarketing dinâmico e automação de carrinho abandonado com IA.',
    results: [
      { icon: TrendingUp, label: 'ROAS', value: '12x', color: 'text-indigo-400' },
      { icon: DollarSign, label: 'Faturamento Mensal', value: '+1.167%', color: 'text-emerald-400' },
      { icon: Users, label: 'Redução no CAC', value: '-68%', color: 'text-purple-400' },
    ],
    services: ['Meta Ads', 'Google Shopping', 'Automação', 'Email Marketing'],
    duration: '6 meses',
    investment: 'R$15K/mês',
    featured: true,
  },
  {
    slug: 'clinica-odontologica-340-leads-mes',
    client: 'Clínica Odonto Premium — São Paulo',
    niche: 'Saúde',
    nicheColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    title: '340 leads qualificados por mês com R$18 cada',
    description:
      'Clínica odontológica que dependia de indicação e estava perdendo leads fora do horário comercial. Implementamos campanhas no Google Ads, landing page específica para implantes e SDR com IA para qualificação 24h.',
    results: [
      { icon: Users, label: 'Leads/Mês', value: '340', color: 'text-indigo-400' },
      { icon: TrendingUp, label: 'Taxa de Conversão', value: '28%', color: 'text-emerald-400' },
      { icon: DollarSign, label: 'Custo por Lead', value: 'R$18', color: 'text-purple-400' },
    ],
    services: ['Google Ads', 'Meta Ads', 'SDR com IA', 'Landing Page'],
    duration: '4 meses',
    investment: 'R$8K/mês',
    featured: true,
  },
  {
    slug: 'imobiliaria-top-imoveis-crm-ia',
    client: 'Top Imóveis — Imobiliária',
    niche: 'Imóveis',
    nicheColor: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    title: 'CRM + IA: 85% mais reuniões agendadas com compradores',
    description:
      'Imobiliária com leads chegando mas time sobrecarregado e tempo de resposta alto. Integramos CRM ao WhatsApp com IA conversacional, eliminando o tempo manual de resposta e qualificando automaticamente.',
    results: [
      { icon: TrendingUp, label: 'Mais Reuniões', value: '+85%', color: 'text-indigo-400' },
      { icon: BarChart2, label: 'Tempo de Resposta', value: '< 2 min', color: 'text-emerald-400' },
      { icon: DollarSign, label: 'Aumento em Vendas', value: '+42%', color: 'text-purple-400' },
    ],
    services: ['CRM', 'WhatsApp IA', 'Automação Comercial', 'Meta Ads'],
    duration: '3 meses',
    investment: 'R$12K/mês',
    featured: true,
  },
  {
    slug: 'escola-cursos-5x-matriculas',
    client: 'Academia Digital Pro',
    niche: 'Educação',
    nicheColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    title: '5x mais matrículas em 8 meses sem aumentar o time',
    description:
      'Escola de cursos online que queria escalar sem aumentar proporcionalmente os custos. Criamos funil completo de vendas com tráfego pago, landing pages para cada curso e automação de nutrição por email e WhatsApp.',
    results: [
      { icon: TrendingUp, label: 'Mais Matrículas', value: '5x', color: 'text-indigo-400' },
      { icon: DollarSign, label: 'Custo por Matrícula', value: '-52%', color: 'text-emerald-400' },
      { icon: BarChart2, label: 'ROI das Campanhas', value: '820%', color: 'text-purple-400' },
    ],
    services: ['Meta Ads', 'Google Ads', 'Email Marketing', 'Funil de Vendas'],
    duration: '8 meses',
    investment: 'R$10K/mês',
    featured: false,
  },
  {
    slug: 'academia-fitlife-leads-qualificados',
    client: 'Academia FitLife',
    niche: 'Fitness',
    nicheColor: 'bg-red-500/15 text-red-400 border-red-500/20',
    title: 'Dobro de matrículas mensais com 65% menos custo por lead',
    description:
      'Academia com alta competição local que queria crescer sem guerra de preços. Utilizamos Meta Ads com criativos de resultado (antes e depois) e geolocalização precisa para capturar leads na área de influência.',
    results: [
      { icon: Users, label: 'Aumento em Matrículas', value: '2x', color: 'text-indigo-400' },
      { icon: DollarSign, label: 'Redução no CPL', value: '-65%', color: 'text-emerald-400' },
      { icon: TrendingUp, label: 'ROAS Médio', value: '6.8x', color: 'text-purple-400' },
    ],
    services: ['Meta Ads', 'Google Ads', 'Landing Page', 'Automação'],
    duration: '5 meses',
    investment: 'R$5K/mês',
    featured: false,
  },
  {
    slug: 'construtora-pipeline-leads',
    client: 'Construtora Terraforte',
    niche: 'Construção Civil',
    nicheColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    title: 'De 12 para 47 oportunidades ativas no pipeline em 90 dias',
    description:
      'Construtora B2B que dependia exclusivamente de networking. Criamos estratégia de LinkedIn Ads e Google Ads focada em decisores, com landing pages específicas para cada tipo de obra.',
    results: [
      { icon: TrendingUp, label: 'Oportunidades no Pipeline', value: '+292%', color: 'text-indigo-400' },
      { icon: DollarSign, label: 'Valor Médio por Contrato', value: 'R$2,1M', color: 'text-emerald-400' },
      { icon: BarChart2, label: 'Tempo para Qualificar', value: '-80%', color: 'text-purple-400' },
    ],
    services: ['LinkedIn Ads', 'Google Ads', 'SDR com IA', 'CRM'],
    duration: '3 meses',
    investment: 'R$18K/mês',
    featured: false,
  },
]

export default function CasesPage() {
  const niches = [...new Set(cases.map((c) => c.niche))]

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[400px] rounded-full bg-emerald-600/8 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
              Resultados Reais
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Cases de{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                sucesso comprovado
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Números reais de empresas que transformaram seu marketing e vendas com a GM Mídia
              Digital. Sem inventar resultados.
            </p>

            <div className="mt-8 flex items-center justify-center gap-8 flex-wrap">
              {[
                { value: '150+', label: 'Casos atendidos' },
                { value: '340%', label: 'ROI médio' },
                { value: '10+', label: 'Nichos de mercado' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cases.map((item) => (
              <div
                key={item.slug}
                className="group p-7 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${item.nicheColor}`}
                  >
                    {item.niche}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{item.duration}</span>
                    <span>·</span>
                    <span>{item.investment}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-1">{item.client}</p>
                <h2 className="text-xl font-bold text-white leading-tight mb-3">{item.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{item.description}</p>

                {/* Results */}
                <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-white/5 mb-5">
                  {item.results.map((result) => {
                    const Icon = result.icon
                    return (
                      <div key={result.label} className="text-center">
                        <div className={`text-xl font-black ${result.color}`}>{result.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{result.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Services tags */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <span
                        key={service}
                        className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-gray-400"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0F0F0F] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Quer ser o próximo case de sucesso?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Agende um diagnóstico gratuito e vamos descobrir juntos como multiplicar seus
            resultados.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-indigo-500/20 group"
          >
            Agendar Diagnóstico Gratuito
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  )
}
