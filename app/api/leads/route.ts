import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { leadSchema } from '@/lib/validations'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = leadSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Get source from referer or body
    const source = data.source || request.headers.get('referer') || 'website'

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service: data.service,
        message: data.message,
        source,
        status: 'NEW',
      },
    })

    // Send emails (fire and forget - don't block response)
    const emailData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    }

    Promise.all([
      sendLeadNotification(emailData).catch((err) =>
        console.error('Failed to send lead notification:', err)
      ),
      sendLeadConfirmation(emailData).catch((err) =>
        console.error('Failed to send lead confirmation:', err)
      ),
    ])

    return NextResponse.json(
      {
        success: true,
        message: 'Lead registrado com sucesso! Entraremos em contato em breve.',
        id: lead.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where = status ? { status: status as any } : {}

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ])

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}
