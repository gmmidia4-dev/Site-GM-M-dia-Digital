import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { blogPostSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const skip = (page - 1) * limit

    const where: any = { published: true }

    if (category) {
      where.category = { slug: category }
    }

    if (featured === 'true') {
      where.featured = true
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: true,
          tags: true,
        },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = blogPostSchema.safeParse(body)

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
    const slug = data.slug || slugify(data.title)

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        published: data.published,
        featured: data.featured,
        readTime: data.readTime,
        categoryId: data.categoryId,
        publishedAt: data.published ? new Date() : null,
      },
      include: { category: true, tags: true },
    })

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Erro ao criar post' }, { status: 500 })
  }
}
