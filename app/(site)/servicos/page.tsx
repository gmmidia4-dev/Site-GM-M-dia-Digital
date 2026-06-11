import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Target,
  Bot,
  Workflow,
  Users,
  MessageSquare,
  BarChart,
  CheckCircle,
  ArrowRight,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços',
  description:
    'Conheça todos os serviços da GM Mídia Digital: Tráfego Pago, SDR com IA, Automação Comercial, Captação de Leads, WhatsApp Inteligente e CRM & Vendas.',
}

const services = [
  {
    id: 'gestao-de-trafego-pago',
    icon: Target,
    title: 'Gestão de Tráfego Pago',
    headline: 'Campanhas de alta performance que transformam cliques em clientes',
    description:
      'Gerenciamos suas campanhas com estratégia, criatividade e otimização contínua. Nossa equipe trabalha diariamente para maximizar o retorno de cada real investido.',
    features: [
      'Estratégia completa de campanhas em todas as plataformas',
      'Criação e teste de criativos de alta conversão',
      'Segmentação avançada de público-alvo',
      'Otimização diária de lances e orçamentos',
      'Remarketing e retargeting inteligente',
      'Relatórios semanais de performance',
      'A/B testing contínuo',
      'Pixel e rastreamento avançado',
    ],
    platforms: ['Meta Ads (Facebook & Instagram)', 'Google Ads', 'YouTube Ads', 'TikTok Ads', 'LinkedIn Ads'],
    color: 'from-indigo-500/15 to-indigo-500/5',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    border: 'border-indigo-500/20',
    result: '+340% ROI médio em 90 dias',
    badge: 'Mais Popular',
  },
  {
    id: 'sdr-ia',
    icon: Bot,
    title: 'SDR com Inteligência Artificial',
    headline: 'Qualificação automática de leads 24 horas por dia, 7 dias por semana',
    description:
      'Nosso SDR com IA nunca dorme, nunca falta e nunca fica de mau humor. Ele qualifica, nutre e agenda reuniões de forma completamente autônoma, liberando seu time comercial para focar em fechar negócios.',
    features: [
      'Atendimento automático via WhatsApp, email e chat',
      'Qualificação de leads por critérios customizados',
      'Agendamento automático de reuniões',
      'Follow-up inteligente com timing otimizado',
      'Integração com seu CRM atual',
      'Scripts personalizados para seu negócio',
      'Análise de sentimento e intenção de compra',
      'Handoff suave para o time humano',
    ],
    platforms: ['WhatsApp Business API', 'Email Marketing', 'Chat no Site', 'Instagram DM', 'LinkedIn'],
    color: 'from-purple-500/15 to-purple-500/5',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    border: 'border-purple-500/20',
    result: 'Até 4x mais leads qualificados',
    badge: 'IA Avançada',
  },
  {
    id: 'automacao-comercial',
    icon: Workflow,
    title: 'Automação Comercial',
    headline: 'Do primeiro contato ao fechamento: tudo automatizado e integrado',
    description:
      'Mapeamos seu processo de vendas e automatizamos cada etapa com as melhores ferramentas do mercado. Elimine tarefas manuais e deixe sua equipe focar no que realmente importa.',
    features: [
      'Mapeamento e otimização do processo de vendas',
      'Implementação de CRM personalizado',
      'Funis de vendas automatizados',
      'Integrações via API e Webhook',
      'Automações de email e WhatsApp',
      'Alertas e notificações automáticas',
      'Pipeline visual e gestão de oportunidades',
      'Relatórios automáticos para gestão',
    ],
    platforms: ['HubSpot', 'RD Station', 'Pipedrive', 'ActiveCampaign', 'Make/Zapier'],
    color: 'from-emerald-500/15 to-emerald-500/5',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
    result: '-60% em tempo operacional',
    badge: null,
  },
  {
    id: 'captacao-de-leads',
    icon: Users,
    title: 'Captação de Leads',
    headline: 'Atraia, capture e converta os leads certos para seu negócio',
    description:
      'Criamos um ecossistema completo de captação com landing pages de alta conversão, formulários inteligentes e estratégias de nutrição para transformar visitantes em compradores.',
    features: [
      'Landing pages otimizadas para conversão',
      'Lead magnets e ofertas irresistíveis',
      'Formulários inteligentes com qualificação',
      'Estratégias de Inbound Marketing',
      'Email marketing automatizado',
      'Sequências de nutrição personalizadas',
      'Lead scoring e priorização automática',
      'Integração com plataformas de ads',
    ],
    platforms: ['Meta Lead Ads', 'Google Lead Forms', 'RD Station', 'Mailchimp', 'Webflow'],
    color: 'from-orange-500/15 to-orange-500/5',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    border: 'border-orange-500/20',
    result: 'Custo por lead até 65% menor',
    badge: null,
  },
  {
    id: 'whatsapp-inteligente',
    icon: MessageSquare,
    title: 'WhatsApp Inteligente',
    headline: 'Transforme o WhatsApp no seu principal canal de vendas e atendimento',
    description:
      'Com 97% dos brasileiros usando WhatsApp, é impossível não estar lá. Criamos chatbots humanizados, sequências de mensagens e estratégias de broadcast que convertem visitantes em clientes.',
    features: [
      'Chatbot humanizado com IA conversacional',
      'Qualificação automática de leads no WhatsApp',
      'Sequências de mensagens automatizadas',
      'Broadcast segmentado para base de contatos',
      'Integração com WhatsApp Business API',
      'Multi-atendimento para equipes',
      'Relatórios de engajamento e conversão',
      'Templates de mensagens aprovados pelo Meta',
    ],
    platforms: ['WhatsApp Business API', 'Twilio', 'Zenvia', 'Take Blip', 'Botpress'],
    color: 'from-green-500/15 to-green-500/5',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    border: 'border-green-500/20',
    result: '+200% em conversas qualificadas',
    badge: null,
  },
  {
    id: 'crm-e-vendas',
    icon: BarChart,
    title: 'CRM e Gestão de Vendas',
    headline: 'Organize, automatize e escale seu processo comercial com dados',
    description:
      'Implantamos um CRM estratégico adaptado ao seu negócio, com automações, dashboards e relatórios que dão ao seu time de vendas visibilidade total e eficiência máxima.',
    features: [
      'Implantação e configuração do CRM ideal',
      'Pipeline de vendas personalizado',
      'Automação de follow-up e tarefas',
      'Dashboards de vendas em tempo real',
      'Gestão de metas e comissões',
      'Previsão de vendas (forecast)',
      'Relatórios de performance do time',
      'Integração com marketing e operações',
    ],
    platforms: ['Salesforce', 'HubSpot CRM', 'Pipedrive', 'RD Station CRM', 'Monday Sales'],
    color: 'from-cyan-500/15 to-cyan-500/5',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    border: 'border-cyan-500/20',
    result: '+42% em taxa de fechamento',
    badge: null,
  },
]

export default function ServicosPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0F0F0F] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] rounded-full bg-indigo-600/8 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
            O Que Fazemos
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Soluções completas para{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              escalar suas vendas
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Do tráfego pago ao SDR com IA — criamos um ecossistema de marketing e vendas
            completamente integrado para o seu negócio crescer de forma previsível.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              <Zap className="w-4 h-4" />
              Solicitar Diagnóstico Gratuito
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                id={service.id}
                className={`p-8 lg:p-12 rounded-3xl bg-gradient-to-br ${service.color} border ${service.border} relative overflow-hidden`}
              >
                {service.badge && (
                  <span className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full bg-indigo-500 text-white">
                    {service.badge}
                  </span>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  <div>
                    <div
                      className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6`}
                    >
                      <Icon className={`w-7 h-7 ${service.iconColor}`} />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
                      {service.title}
                    </h2>
                    <p className={`text-lg font-semibold ${service.iconColor} mb-4`}>
                      {service.headline}
                    </p>
                    <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8`}
                    >
                      <CheckCircle className={`w-4 h-4 ${service.iconColor}`} />
                      <span className="text-sm text-gray-300 font-semibold">{service.result}</span>
                    </div>

                    <Link
                      href="/contato"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 group ${service.iconColor} border ${service.border} hover:bg-white/5`}
                    >
                      Solicitar esse serviço
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h3 className="text-white font-bold mb-4">O que está incluso:</h3>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle
                              className={`w-5 h-5 ${service.iconColor} shrink-0 mt-0.5`}
                            />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-white font-bold mb-3">Plataformas que utilizamos:</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0F0F0F] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Não sabe por onde começar?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Faça uma diagnóstico gratuito e descobriremos juntos quais serviços vão gerar mais
            resultado para o seu negócio.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-indigo-500/20 group"
          >
            Diagnóstico Gratuito Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  )
}
