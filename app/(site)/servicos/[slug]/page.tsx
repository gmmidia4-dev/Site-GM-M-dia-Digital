import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

const services: Record<string, any> = {
  'gestao-de-trafego-pago': {
    title: 'Gestão de Tráfego Pago',
    description: 'Campanhas de alta performance em Meta Ads, Google Ads, YouTube e TikTok Ads.',
    content: 'Gerenciamos suas campanhas com estratégia, criatividade e otimização contínua para maximizar o retorno de cada real investido.',
  },
  'sdr-ia': {
    title: 'SDR com Inteligência Artificial',
    description: 'Qualificação automática de leads 24h/dia com IA que entende e responde.',
    content: 'Nosso SDR com IA nunca dorme. Qualifica, nutre e agenda reuniões de forma completamente autônoma.',
  },
  'automacao-comercial': {
    title: 'Automação Comercial',
    description: 'CRM integrado, funis automatizados e integrações avançadas para o seu processo de vendas.',
    content: 'Automatizamos cada etapa do seu processo de vendas com as melhores ferramentas do mercado.',
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = services[params.slug]
  return {
    title: service?.title || 'Serviço',
    description: service?.description,
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = services[params.slug]

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/servicos"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver todos os serviços
        </Link>

        {service ? (
          <>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">{service.title}</h1>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">{service.description}</p>
            <p className="text-gray-300 leading-relaxed mb-10">{service.content}</p>

            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300"
            >
              Solicitar esse serviço
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-black text-white mb-4">Serviço não encontrado</h1>
            <Link href="/servicos" className="text-indigo-400 hover:text-indigo-300">
              Ver todos os serviços
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
