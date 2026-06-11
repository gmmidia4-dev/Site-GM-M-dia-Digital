import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'

// Static placeholder posts for build - in production these come from DB
const posts: Record<string, any> = {
  'como-reduzir-cpl-meta-ads-2024': {
    title: 'Como Reduzir seu Custo por Lead no Meta Ads em 2024',
    excerpt: 'Descubra as 7 estratégias que utilizamos para reduzir o custo por lead dos nossos clientes em até 65%.',
    content: `
# Como Reduzir seu Custo por Lead no Meta Ads em 2024

O custo por lead (CPL) é uma das métricas mais críticas em qualquer campanha de geração de leads. Um CPL alto significa que você está gastando mais do que o necessário para adquirir cada cliente potencial.

## 1. Segmentação mais precisa

A segmentação ampla pode parecer boa ideia, mas na maioria das vezes gera leads de baixa qualidade. Utilize públicos personalizados baseados em:

- Visitantes do seu site (pixel do Meta)
- Listas de clientes existentes (lookalike)
- Engajamento com suas postagens e vídeos
- Interações com seu perfil do Instagram

## 2. Criativos de alta conversão

O criativo é responsável por 70% do desempenho da sua campanha. Invista em:

- Vídeos curtos (15-30 segundos) com hook forte nos primeiros 3 segundos
- Imagens com contraste alto e texto mínimo
- Depoimentos de clientes reais com resultados específicos
- Proof of concept: mostre o antes e depois

## 3. Otimize o funil de conversão

Não basta ter um bom anúncio. A landing page precisa:

- Carregar em menos de 2 segundos
- Ter um formulário com no máximo 5 campos
- Apresentar uma proposta de valor clara e irresistível
- Ter uma prova social visível (logos, depoimentos, números)

## 4. Use o Advantage+ com cuidado

O Meta Advantage+ pode ser poderoso, mas também pode desperdiçar budget. Configure:

- Orçamentos diários com limites claros
- Exclusões de público para evitar desperdiçar impressões
- Controle manual de criativos nos primeiros 14 dias

## 5. Remarketing inteligente

Retargeting para quem já visitou o site converte 10x mais que tráfego frio:

- Visitantes dos últimos 7 dias: oferta mais agressiva
- Visitantes de 7-30 dias: conteúdo educacional
- Abandono de formulário: mensagem específica

## 6. Teste contínuo (A/B Testing)

A maioria das contas para de testar depois do primeiro bom resultado. Mantenha sempre:

- 2-3 variações de headlines testando simultaneamente
- Diferentes formatos: imagem, vídeo, carrossel
- Diferentes ofertas: lead magnet, diagnóstico, trial

## 7. Análise de dados e otimização diária

Revise sua conta todos os dias e tome ações baseadas em dados:

- Pause anúncios com CPM acima de 2x a média
- Aumente budget em anúncios com CPL abaixo da meta
- Analise a frequência e renove criativos quando > 2.5

Aplicando essas estratégias consistentemente, reduzimos o CPL de nossos clientes em 40% a 65% em média nos primeiros 90 dias.
    `,
    category: 'Tráfego Pago',
    readTime: 8,
    date: '15 Nov 2024',
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts[params.slug]
  if (!post) return { title: 'Post não encontrado' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Post não encontrado</h1>
          <Link
            href="/blog"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <article className="pt-32 pb-20 bg-[#0F0F0F]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-8 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} min de leitura
              </span>
              <span>GM Mídia Digital</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
            {post.content.split('\n').map((line: string, i: number) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-white mt-8 mb-4">{line.slice(2)}</h1>
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">{line.slice(4)}</h3>
              if (line.startsWith('- ')) return <li key={i} className="text-gray-300 ml-4">{line.slice(2)}</li>
              if (line.trim() === '') return <br key={i} />
              return <p key={i}>{line}</p>
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Quer aplicar essas estratégias?</h3>
            <p className="text-gray-400 mb-6">
              Agende um diagnóstico gratuito e nossa equipe vai criar uma estratégia personalizada para
              o seu negócio.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
            >
              Diagnóstico Gratuito
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
