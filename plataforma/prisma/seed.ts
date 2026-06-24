/**
 * Seed de demonstração.
 * Cria uma agência, usuários (admin, gestor e cliente), clientes, integrações,
 * ~60 dias de métricas sintéticas e um relatório por cliente.
 *
 * Rodar com: npm run db:seed
 */
import { PrismaClient, type Platform } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generateDemoInsights } from '../src/lib/integrations/demo'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

const CLIENTS = [
  { name: 'Loja Vitória E-commerce', segment: 'E-commerce', brandPrimary: '#EC4899', platforms: ['META_ADS', 'GOOGLE_ADS', 'TIKTOK_ADS'] },
  { name: 'Clínica Bem Estar', segment: 'Saúde', brandPrimary: '#06B6D4', platforms: ['META_ADS', 'GOOGLE_ADS'] },
  { name: 'EduMais Cursos', segment: 'Educação', brandPrimary: '#F59E0B', platforms: ['META_ADS', 'GOOGLE_ADS', 'GA4'] },
  { name: 'TechB2B Software', segment: 'SaaS B2B', brandPrimary: '#8B5CF6', platforms: ['LINKEDIN_ADS', 'GOOGLE_ADS', 'SEARCH_CONSOLE'] },
] as const

async function main() {
  console.log('🌱 Limpando dados antigos…')
  await prisma.metricDaily.deleteMany()
  await prisma.aiInsight.deleteMany()
  await prisma.reportDelivery.deleteMany()
  await prisma.report.deleteMany()
  await prisma.reportSchedule.deleteMany()
  await prisma.integration.deleteMany()
  await prisma.clientUser.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()
  await prisma.agency.deleteMany()

  const password = await bcrypt.hash('demo1234', 10)

  console.log('🏢 Criando agência e equipe…')
  const agency = await prisma.agency.create({
    data: {
      name: 'Agência Demo',
      slug: 'agencia-demo',
      brandPrimary: '#6366F1',
      brandSecondary: '#10B981',
      website: 'https://agenciademo.com.br',
      plan: 'AGENCY',
      users: {
        create: [
          { name: 'Admin Demo', email: 'admin@demo.com', password, role: 'ADMIN' },
          { name: 'Gestor de Tráfego', email: 'gestor@demo.com', password, role: 'MANAGER' },
        ],
      },
    },
  })

  const start = isoDaysAgo(60)
  const end = isoDaysAgo(1)
  let firstClientId = ''

  for (const c of CLIENTS) {
    console.log(`👤 Cliente: ${c.name}`)
    const client = await prisma.client.create({
      data: {
        agencyId: agency.id,
        name: c.name,
        segment: c.segment,
        brandPrimary: c.brandPrimary,
        contactName: 'Responsável ' + c.name.split(' ')[0],
        contactEmail: `contato@${c.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.com`,
        contactPhone: '5511999990000',
      },
    })
    if (!firstClientId) firstClientId = client.id

    for (const platform of c.platforms as readonly Platform[]) {
      const integration = await prisma.integration.create({
        data: {
          agencyId: agency.id,
          clientId: client.id,
          platform,
          externalAccountId: `${platform.toLowerCase()}_${client.id}`,
          accountName: `${c.name} — ${platform}`,
          status: 'CONNECTED',
          lastSyncedAt: new Date(),
        },
      })

      const insights = generateDemoInsights(platform, integration.id, start, end)
      await prisma.metricDaily.createMany({
        data: insights.map((r) => ({
          integrationId: integration.id,
          date: new Date(r.date),
          campaignId: r.campaignId ?? '',
          campaignName: r.campaignName,
          spend: r.spend,
          impressions: r.impressions,
          reach: r.reach,
          clicks: r.clicks,
          conversions: r.conversions,
          leads: r.leads,
          revenue: r.revenue,
        })),
        skipDuplicates: true,
      })
    }

    // Relatório mensal pronto (snapshot é reconstruído na visualização)
    await prisma.report.create({
      data: {
        agencyId: agency.id,
        clientId: client.id,
        title: `${c.name} — Relatório mensal`,
        period: 'MONTHLY',
        startDate: new Date(isoDaysAgo(30)),
        endDate: new Date(end),
        status: 'READY',
        generatedAt: new Date(),
        shareToken: randomBytes(12).toString('base64url'),
      },
    })

    // Agendamento mensal automático
    await prisma.reportSchedule.create({
      data: {
        agencyId: agency.id,
        clientId: client.id,
        frequency: 'MONTHLY',
        channels: ['EMAIL', 'LINK'],
        recipients: [client.contactEmail!],
        includeAi: true,
        isActive: true,
      },
    })
  }

  console.log('🔑 Criando usuário de cliente final…')
  const clientUser = await prisma.user.create({
    data: { name: 'Cliente Final', email: 'cliente@demo.com', password, role: 'CLIENT', agencyId: agency.id },
  })
  await prisma.clientUser.create({ data: { userId: clientUser.id, clientId: firstClientId } })

  console.log('\n✅ Seed concluído!')
  console.log('   Admin:   admin@demo.com / demo1234')
  console.log('   Gestor:  gestor@demo.com / demo1234')
  console.log('   Cliente: cliente@demo.com / demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
