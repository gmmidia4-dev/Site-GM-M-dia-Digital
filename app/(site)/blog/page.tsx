import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artigos, guias e insights sobre marketing digital, tráfego pago, automação comercial e IA para escalar vendas.',
}

const posts = [
  {
    slug: 'como-reduzir-cpl-meta-ads-2024',
    title: 'Como Reduzir seu Custo por Lead no Meta Ads em 2024',
    excerpt:
      'Descubra as 7 estratégias que utilizamos para reduzir o custo por lead dos nossos clientes em até 65% sem comprometer a qualidade. Guia completo com exemplos reais.',
    category: 'Tráfego Pago',
    categoryColor: 'bg-indigo-500/15 text-indigo-400',
    readTime: 8,
    date: '15 Nov 2024',
    featured: true,
    image: null,
  },
  {
    slug: 'sdr-ia-vs-sdr-humano-quando-usar',
    title: 'SDR com IA vs SDR Humano: Quando Usar Cada Um',
    excerpt:
      'A IA nunca substitui o toque humano em vendas complexas, mas pode ser 10x mais eficiente em qualificação. Saiba quando usar cada abordagem na sua empresa.',
    category: 'SDR & IA',
    categoryColor: 'bg-purple-500/15 text-purple-400',
    readTime: 6,
    date: '08 Nov 2024',
    featured: false,
    image: null,
  },
  {
    slug: 'automacao-whatsapp-vendas-b2c',
    title: 'Automação de WhatsApp para Vendas B2C: Guia Completo',
    excerpt:
      'Como configurar sequências automáticas de WhatsApp que convertem sem parecer spam. Inclui templates prontos e estratégias de timing.',
    category: 'Automação',
    categoryColor: 'bg-emerald-500/15 text-emerald-400',
    readTime: 10,
    date: '01 Nov 2024',
    featured: false,
    image: null,
  },
  {
    slug: 'roi-marketing-digital-como-calcular',
    title: 'ROI de Marketing Digital: Como Calcular e Otimizar',
    excerpt:
      'O ROI não é só uma métrica — é o guia de tomada de decisão mais importante do seu marketing. Aprenda a calcular, interpretar e melhorar o seu.',
    category: 'Marketing Digital',
    categoryColor: 'bg-orange-500/15 text-orange-400',
    readTime: 7,
    date: '24 Out 2024',
    featured: false,
    image: null,
  },
  {
    slug: 'google-ads-para-clinicas-guia-completo',
    title: 'Google Ads para Clínicas: Guia Completo 2024',
    excerpt:
      'Tudo que você precisa saber para gerar pacientes qualificados via Google Ads: desde a estrutura da conta até a criação de campanhas que convertem.',
    category: 'Tráfego Pago',
    categoryColor: 'bg-indigo-500/15 text-indigo-400',
    readTime: 12,
    date: '17 Out 2024',
    featured: false,
    image: null,
  },
  {
    slug: 'crm-para-pequenas-empresas-como-escolher',
    title: 'CRM para Pequenas Empresas: Como Escolher em 2024',
    excerpt:
      'Com mais de 500 CRMs disponíveis, como escolher o certo para o seu negócio? Comparamos as 5 principais opções com critérios objetivos.',
    category: 'CRM & Vendas',
    categoryColor: 'bg-cyan-500/15 text-cyan-400',
    readTime: 9,
    date: '10 Out 2024',
    featured: false,
    image: null,
  },
]

const categories = ['Todos', 'Tráfego Pago', 'SDR & IA', 'Automação', 'CRM & Vendas', 'Marketing Digital']

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured)
  const regularPosts = posts.filter((p) => !p.featured)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            Blog
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
            Insights de{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              marketing que geram resultados
            </span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Artigos práticos sobre tráfego pago, automação, IA e estratégias para escalar suas
            vendas.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="flex items-center gap-2 mb-12 flex-wrap">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  i === 0
                    ? 'bg-indigo-500 text-white'
                    : 'bg-[#111111] text-gray-400 hover:text-white hover:bg-[#1A1A1A] border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <Link href={`/blog/${featuredPost.slug}`}>
                <div className="group p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${featuredPost.categoryColor}`}>
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      Artigo em Destaque
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-6 max-w-3xl">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime} min de leitura
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-indigo-400 font-semibold group-hover:gap-2.5 transition-all">
                      Ler artigo
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group h-full p-6 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl flex flex-col">
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.categoryColor}`}>
                      {post.category}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-indigo-300 transition-colors flex-1">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime} min
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
