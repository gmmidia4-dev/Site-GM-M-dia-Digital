import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123!@#', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmmidia.com.br' },
    update: {},
    create: {
      name: 'Administrador GM',
      email: 'admin@gmmidia.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', adminUser.email)

  // Create categories for blog
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'trafego-pago' },
      update: {},
      create: { name: 'Tráfego Pago', slug: 'trafego-pago' },
    }),
    prisma.category.upsert({
      where: { slug: 'sdr-ia' },
      update: {},
      create: { name: 'SDR & IA', slug: 'sdr-ia' },
    }),
    prisma.category.upsert({
      where: { slug: 'automacao' },
      update: {},
      create: { name: 'Automação Comercial', slug: 'automacao' },
    }),
    prisma.category.upsert({
      where: { slug: 'crm-vendas' },
      update: {},
      create: { name: 'CRM & Vendas', slug: 'crm-vendas' },
    }),
    prisma.category.upsert({
      where: { slug: 'marketing-digital' },
      update: {},
      create: { name: 'Marketing Digital', slug: 'marketing-digital' },
    }),
  ])
  console.log('✅ Categories created:', categories.length)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'meta-ads' },
      update: {},
      create: { name: 'Meta Ads', slug: 'meta-ads' },
    }),
    prisma.tag.upsert({
      where: { slug: 'google-ads' },
      update: {},
      create: { name: 'Google Ads', slug: 'google-ads' },
    }),
    prisma.tag.upsert({
      where: { slug: 'inteligencia-artificial' },
      update: {},
      create: { name: 'Inteligência Artificial', slug: 'inteligencia-artificial' },
    }),
    prisma.tag.upsert({
      where: { slug: 'roi' },
      update: {},
      create: { name: 'ROI', slug: 'roi' },
    }),
    prisma.tag.upsert({
      where: { slug: 'whatsapp' },
      update: {},
      create: { name: 'WhatsApp', slug: 'whatsapp' },
    }),
  ])
  console.log('✅ Tags created:', tags.length)

  // Create sample blog posts
  const posts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'como-reduzir-cpl-meta-ads-2024' },
      update: {},
      create: {
        title: 'Como Reduzir seu Custo por Lead no Meta Ads em 2024',
        slug: 'como-reduzir-cpl-meta-ads-2024',
        excerpt:
          'Descubra as 7 estratégias que utilizamos para reduzir o custo por lead dos nossos clientes em até 65% sem comprometer a qualidade.',
        content: `# Como Reduzir seu Custo por Lead no Meta Ads em 2024

O custo por lead (CPL) é uma das métricas mais críticas em qualquer campanha de geração de leads.

## 1. Segmentação mais precisa

Utilize públicos personalizados baseados em visitantes do site, listas de clientes existentes e engajamento.

## 2. Criativos de alta conversão

O criativo é responsável por 70% do desempenho da sua campanha. Invista em vídeos curtos com hook forte.

## 3. Otimize o funil de conversão

Não basta ter um bom anúncio. A landing page precisa carregar em menos de 2 segundos.

## 4. Remarketing inteligente

Retargeting para quem já visitou o site converte 10x mais que tráfego frio.`,
        published: true,
        featured: true,
        readTime: 8,
        views: 1234,
        categoryId: categories[0].id,
        publishedAt: new Date('2024-11-15'),
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: 'sdr-ia-vs-sdr-humano-quando-usar' },
      update: {},
      create: {
        title: 'SDR com IA vs SDR Humano: Quando Usar Cada Um',
        slug: 'sdr-ia-vs-sdr-humano-quando-usar',
        excerpt:
          'A IA nunca substitui o toque humano em vendas complexas, mas pode ser 10x mais eficiente em qualificação.',
        content: `# SDR com IA vs SDR Humano: Quando Usar Cada Um

A questão não é substituição, mas complementaridade.

## Quando usar SDR com IA

- Qualificação inicial de leads (perguntas padronizadas)
- Atendimento fora do horário comercial
- Follow-up automatizado
- Agendamento de reuniões

## Quando usar SDR Humano

- Negociações complexas e de alto valor
- Relacionamento com prospects de alto nível
- Vendas consultivas que exigem empatia
- Situações que fogem do script`,
        published: true,
        featured: false,
        readTime: 6,
        views: 876,
        categoryId: categories[1].id,
        publishedAt: new Date('2024-11-08'),
      },
    }),
  ])
  console.log('✅ Blog posts created:', posts.length)

  // Create sample testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.upsert({
      where: { id: 'testimonial-1' },
      update: {},
      create: {
        id: 'testimonial-1',
        name: 'Ricardo Almeida',
        role: 'CEO',
        company: 'Grupo Almeida Imóveis',
        content:
          'Em 4 meses com a GM Mídia Digital, nossas reuniões com compradores qualificados aumentaram 85%. A automação com WhatsApp e o CRM transformaram completamente nosso processo comercial. Hoje vendemos 3x mais com o mesmo time.',
        rating: 5,
        featured: true,
        published: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-2' },
      update: {},
      create: {
        id: 'testimonial-2',
        name: 'Fernanda Costa',
        role: 'Diretora de Marketing',
        company: 'Clínica Estética Belle',
        content:
          'Tínhamos muito tráfego mas poucos leads qualificados. A GM Mídia reestruturou nossas campanhas e implantou um SDR com IA que qualifica os pacientes 24h. Nosso faturamento cresceu 210% em 5 meses.',
        rating: 5,
        featured: true,
        published: true,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-3' },
      update: {},
      create: {
        id: 'testimonial-3',
        name: 'Bruno Mendonça',
        role: 'Sócio-fundador',
        company: 'TechVenda Software',
        content:
          'A expertise deles em tráfego pago para B2B é diferenciada. Conseguiram reduzir nosso CPL em 68% e aumentar a qualidade dos leads em 3x.',
        rating: 5,
        featured: false,
        published: true,
      },
    }),
  ])
  console.log('✅ Testimonials created:', testimonials.length)

  // Create sample cases
  const cases = await Promise.all([
    prisma.case.upsert({
      where: { slug: 'ecommerce-moda-premium-380k-mes' },
      update: {},
      create: {
        client: 'Boutique Donna — Moda Premium',
        niche: 'E-commerce',
        title: 'De R$30K para R$380K/mês em 6 meses',
        slug: 'ecommerce-moda-premium-380k-mes',
        description:
          'Loja de moda premium que estava investindo mal em Meta Ads sem estratégia. Reestruturamos toda a conta, criamos campanhas segmentadas por persona e implementamos remarketing dinâmico.',
        results: {
          roas: '12x',
          faturamento: '+1.167%',
          cac: '-68%',
        },
        images: [],
        featured: true,
        published: true,
      },
    }),
    prisma.case.upsert({
      where: { slug: 'clinica-odontologica-340-leads-mes' },
      update: {},
      create: {
        client: 'Clínica Odonto Premium — São Paulo',
        niche: 'Saúde',
        title: '340 leads qualificados por mês com R$18 cada',
        slug: 'clinica-odontologica-340-leads-mes',
        description:
          'Clínica odontológica que dependia de indicação. Implementamos Google Ads, landing page e SDR com IA para qualificação 24h.',
        results: {
          leads_mes: '340',
          taxa_conversao: '28%',
          custo_lead: 'R$18',
        },
        images: [],
        featured: true,
        published: true,
      },
    }),
  ])
  console.log('✅ Cases created:', cases.length)

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'gestao-de-trafego-pago' },
      update: {},
      create: {
        name: 'Gestão de Tráfego Pago',
        slug: 'gestao-de-trafego-pago',
        description: 'Campanhas de alta performance em Meta Ads, Google Ads, YouTube e TikTok Ads.',
        content: 'Gerenciamos suas campanhas com estratégia, criatividade e otimização contínua para maximizar o retorno de cada real investido.',
        icon: 'Target',
        featured: true,
        order: 1,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'sdr-ia' },
      update: {},
      create: {
        name: 'SDR com Inteligência Artificial',
        slug: 'sdr-ia',
        description: 'Qualificação automática de leads 24h/dia com IA.',
        content: 'Nosso SDR com IA nunca dorme. Qualifica, nutre e agenda reuniões de forma completamente autônoma.',
        icon: 'Bot',
        featured: true,
        order: 2,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'automacao-comercial' },
      update: {},
      create: {
        name: 'Automação Comercial',
        slug: 'automacao-comercial',
        description: 'CRM integrado, funis automatizados e integrações avançadas.',
        content: 'Automatizamos cada etapa do seu processo de vendas com as melhores ferramentas do mercado.',
        icon: 'Workflow',
        featured: true,
        order: 3,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'captacao-de-leads' },
      update: {},
      create: {
        name: 'Captação de Leads',
        slug: 'captacao-de-leads',
        description: 'Landing pages de alta conversão e estratégias de segmentação.',
        content: 'Criamos um ecossistema completo de captação para transformar visitantes em compradores.',
        icon: 'Users',
        featured: true,
        order: 4,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'whatsapp-inteligente' },
      update: {},
      create: {
        name: 'WhatsApp Inteligente',
        slug: 'whatsapp-inteligente',
        description: 'Chatbot humanizado, sequências e broadcast segmentado.',
        content: 'Transforme o WhatsApp no seu principal canal de vendas com automação e IA.',
        icon: 'MessageSquare',
        featured: true,
        order: 5,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'crm-e-vendas' },
      update: {},
      create: {
        name: 'CRM e Gestão de Vendas',
        slug: 'crm-e-vendas',
        description: 'Pipeline visual, automação de follow-up e relatórios completos.',
        content: 'Organize e escale seu processo comercial com dados e automação.',
        icon: 'BarChart',
        featured: true,
        order: 6,
      },
    }),
  ])
  console.log('✅ Services created:', services.length)

  // Create settings
  await Promise.all([
    prisma.setting.upsert({
      where: { key: 'whatsapp_number' },
      update: {},
      create: { key: 'whatsapp_number', value: '5511999999999' },
    }),
    prisma.setting.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: { key: 'contact_email', value: 'contato@gmmidia.com.br' },
    }),
    prisma.setting.upsert({
      where: { key: 'company_name' },
      update: {},
      create: { key: 'company_name', value: 'GM Mídia Digital' },
    }),
  ])
  console.log('✅ Settings created')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Admin credentials:')
  console.log('   Email: admin@gmmidia.com.br')
  console.log('   Password: admin123!@#')
  console.log('\n⚠️  IMPORTANT: Change the admin password after first login!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
