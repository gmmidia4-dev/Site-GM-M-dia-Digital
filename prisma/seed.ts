import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin@GM2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmmidia.com.br' },
    update: {},
    create: {
      name: 'Administrador GM',
      email: 'admin@gmmidia.com.br',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin criado:', admin.email)

  // Categories
  const categories = [
    { name: 'Tráfego Pago', slug: 'trafego-pago' },
    { name: 'SDR & IA', slug: 'sdr-ia' },
    { name: 'Automação', slug: 'automacao' },
    { name: 'CRM & Vendas', slug: 'crm-vendas' },
    { name: 'Marketing Digital', slug: 'marketing-digital' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categorias criadas')

  // Get category for blog posts
  const categoryTrafego = await prisma.category.findUnique({ where: { slug: 'trafego-pago' } })
  const categorySDR = await prisma.category.findUnique({ where: { slug: 'sdr-ia' } })

  if (categoryTrafego && categorySDR) {
    // Sample blog posts
    const posts = [
      {
        title: 'Como Reduzir seu Custo por Lead no Meta Ads em 2024',
        slug: 'como-reduzir-cpl-meta-ads-2024',
        excerpt: 'Descubra as 7 estratégias que utilizamos para reduzir o custo por lead em até 65% sem comprometer a qualidade.',
        content: `<h2>Introdução</h2>
<p>O Meta Ads continua sendo uma das plataformas mais poderosas para captação de leads, mas muitas empresas estão desperdiçando orçamento por falta de estratégia. Neste guia, compartilhamos as mesmas táticas que usamos com nossos clientes para reduzir o CPL em até 65%.</p>

<h2>1. Otimize seu Objetivo de Campanha</h2>
<p>O erro mais comum é usar o objetivo errado. Para leads de qualidade, use "Leads" com formulário nativo ou "Conversão" para seu site. Nunca use "Tráfego" esperando leads.</p>

<h2>2. Segmentação Baseada em Dados</h2>
<p>Abandone os públicos amplos. Use públicos personalizados de visitantes do site, lista de clientes e lookalikes de 1-2% dos seus melhores clientes.</p>

<h2>3. Criativos que Convertem</h2>
<p>Vídeos curtos de 15-30 segundos performam 3x melhor que imagens estáticas. Mostre resultados reais, não promessas genéricas.</p>

<h2>Conclusão</h2>
<p>Implementando essas estratégias, nossos clientes viram uma redução média de 65% no CPL em 60 dias. O segredo está na combinação de dados, criatividade e otimização constante.</p>`,
        coverImage: null,
        published: true,
        featured: true,
        readTime: 8,
        categoryId: categoryTrafego.id,
        publishedAt: new Date(),
      },
      {
        title: 'SDR com IA vs SDR Humano: Quando Usar Cada Um',
        slug: 'sdr-ia-vs-sdr-humano-quando-usar',
        excerpt: 'A IA nunca substitui o toque humano em vendas complexas, mas pode ser 10x mais eficiente em qualificação.',
        content: `<h2>O Debate do Momento</h2>
<p>SDR com IA ou SDR humano? A resposta não é binária — é uma questão de quando e como usar cada um.</p>

<h2>Onde a IA Vence</h2>
<p>Para qualificação inicial, respostas imediatas 24/7 e follow-up sistemático, a IA é imbatível. Ela nunca esquece de fazer o follow-up e processa centenas de leads simultâneos.</p>

<h2>Onde o Humano é Insubstituível</h2>
<p>Vendas complexas com ticket alto, negociações sofisticadas e relacionamentos de longo prazo ainda precisam do toque humano. A empatia não tem substituto.</p>

<h2>O Modelo Híbrido Ideal</h2>
<p>Os melhores resultados vêm da combinação: IA para triagem e qualificação, humano para fechamento. Isso aumenta a produtividade do time em 3-4x.</p>`,
        coverImage: null,
        published: true,
        featured: false,
        readTime: 6,
        categoryId: categorySDR.id,
        publishedAt: new Date(),
      },
    ]

    for (const post of posts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      })
    }
    console.log('✅ Posts do blog criados')
  }

  // Testimonials
  const testimonials = [
    {
      name: 'Ricardo Almeida',
      role: 'CEO',
      company: 'Grupo Almeida Imóveis',
      content: 'Em 4 meses, nossas reuniões com compradores qualificados aumentaram 85%. A automação com WhatsApp e o CRM transformaram completamente nosso processo comercial.',
      rating: 5,
      featured: true,
      published: true,
    },
    {
      name: 'Fernanda Costa',
      role: 'Diretora de Marketing',
      company: 'Clínica Estética Belle',
      content: 'Tínhamos muito tráfego mas poucos leads qualificados. A GM Mídia reestruturou nossas campanhas e implantou um SDR com IA. Nosso faturamento cresceu 210% em 5 meses.',
      rating: 5,
      featured: true,
      published: true,
    },
    {
      name: 'Bruno Mendonça',
      role: 'Sócio-fundador',
      company: 'TechVenda Software',
      content: 'Conseguiram reduzir nosso CPL em 68% e aumentar a qualidade dos leads em 3x. O acompanhamento semanal e os relatórios detalhados nos dão total transparência.',
      rating: 5,
      featured: false,
      published: true,
    },
  ]

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {})
  }
  console.log('✅ Depoimentos criados')

  // Cases
  const cases = [
    {
      client: 'Boutique Donna — Moda Premium',
      niche: 'E-commerce',
      title: 'De R$30K para R$380K/mês em 6 meses',
      slug: 'boutique-donna-ecommerce-escala',
      description: 'Reestruturação completa das campanhas de Meta Ads e Google Shopping. Implementação de SDR para recuperação de carrinhos e remarketing dinâmico.',
      results: {
        roas: '12x',
        revenue_growth: '+1.167%',
        cac_reduction: '-68%',
      },
      images: [],
      featured: true,
      published: true,
    },
    {
      client: 'Clínica Odonto Premium',
      niche: 'Saúde',
      title: '340 leads qualificados por mês com R$18 cada',
      slug: 'clinica-odonto-premium-leads',
      description: 'Google Ads + Meta Ads com landing page especializada e SDR com IA para qualificação 24h.',
      results: {
        leads_per_month: '340',
        conversion_rate: '28%',
        cost_per_lead: 'R$18',
      },
      images: [],
      featured: true,
      published: true,
    },
  ]

  for (const c of cases) {
    await prisma.case.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }
  console.log('✅ Cases criados')

  // Settings
  const settings = [
    { key: 'whatsapp_number', value: '5511999999999' },
    { key: 'contact_email', value: 'contato@gmmidia.com.br' },
    { key: 'site_name', value: 'GM Mídia Digital' },
    { key: 'site_tagline', value: 'Transformamos Tráfego em Vendas com IA' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log('✅ Configurações criadas')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('📧 Admin email: admin@gmmidia.com.br')
  console.log('🔑 Admin senha: admin@GM2024!')
  console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro acesso!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
