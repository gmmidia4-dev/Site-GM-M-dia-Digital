import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(20, 'Telefone inválido')
    .regex(/^[\d\s\(\)\-\+]+$/, 'Formato de telefone inválido'),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().max(1000, 'Mensagem muito longa').optional(),
  source: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(3, 'Assunto deve ter pelo menos 3 caracteres')
    .max(200, 'Assunto muito longo'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(2000, 'Mensagem muito longa'),
})

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Título obrigatório').max(200, 'Título muito longo'),
  slug: z.string().min(3).max(200).optional(),
  excerpt: z.string().min(10, 'Resumo obrigatório').max(500, 'Resumo muito longo'),
  content: z.string().min(50, 'Conteúdo obrigatório'),
  coverImage: z.string().url('URL de imagem inválida').optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  readTime: z.number().int().min(1).default(5),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
})

export const caseSchema = z.object({
  client: z.string().min(2, 'Nome do cliente obrigatório'),
  niche: z.string().min(2, 'Nicho obrigatório'),
  title: z.string().min(3, 'Título obrigatório'),
  slug: z.string().optional(),
  description: z.string().min(50, 'Descrição obrigatória'),
  results: z.record(z.unknown()),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  role: z.string().min(2, 'Cargo obrigatório'),
  company: z.string().min(2, 'Empresa obrigatória'),
  content: z.string().min(10, 'Depoimento obrigatório').max(1000, 'Depoimento muito longo'),
  rating: z.number().int().min(1).max(5).default(5),
  avatar: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export type LeadInput = z.infer<typeof leadSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type BlogPostInput = z.infer<typeof blogPostSchema>
export type CaseInput = z.infer<typeof caseSchema>
export type TestimonialInput = z.infer<typeof testimonialSchema>
