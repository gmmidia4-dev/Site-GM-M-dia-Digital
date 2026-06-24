import { z } from 'zod'

export const registerSchema = z.object({
  agencyName: z.string().min(2, 'Informe o nome da agência').max(120),
  name: z.string().min(2, 'Informe seu nome').max(120),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres').max(100),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome do cliente obrigatório').max(120),
  logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  segment: z.string().max(80).optional(),
  brandPrimary: z
    .string()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Use um hex como #6366F1')
    .optional()
    .or(z.literal('')),
  contactName: z.string().max(120).optional(),
  contactEmail: z.string().email('E-mail inválido').optional().or(z.literal('')),
  contactPhone: z.string().max(30).optional(),
})

export const integrationSchema = z.object({
  clientId: z.string().min(1, 'Selecione o cliente'),
  platform: z.enum([
    'META_ADS',
    'GOOGLE_ADS',
    'TIKTOK_ADS',
    'LINKEDIN_ADS',
    'GA4',
    'SEARCH_CONSOLE',
  ]),
  externalAccountId: z.string().min(1, 'Informe o ID da conta'),
  accountName: z.string().max(120).optional(),
})

export const reportSchema = z.object({
  clientId: z.string().min(1, 'Selecione o cliente'),
  title: z.string().min(2, 'Título obrigatório').max(160),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']).default('MONTHLY'),
  startDate: z.string(), // ISO date
  endDate: z.string(),
  includeAi: z.boolean().default(true),
})

export const scheduleSchema = z.object({
  clientId: z.string().min(1, 'Selecione o cliente'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  channels: z.array(z.enum(['EMAIL', 'WHATSAPP', 'LINK'])).min(1, 'Selecione ao menos um canal'),
  recipients: z.array(z.string()).min(1, 'Informe ao menos um destinatário'),
  includeAi: z.boolean().default(true),
})

export const agencySchema = z.object({
  name: z.string().min(2).max(120),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  brandPrimary: z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Hex inválido'),
  brandSecondary: z.string().regex(/^#([0-9a-fA-F]{6})$/, 'Hex inválido'),
})

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Informe o nome').max(120),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres').max(100),
  role: z.enum(['ADMIN', 'MANAGER', 'CLIENT']),
  // Para CLIENT: clientes que o usuário poderá visualizar
  clientIds: z.array(z.string()).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type ClientInput = z.infer<typeof clientSchema>
export type ReportInput = z.infer<typeof reportSchema>
export type ScheduleInput = z.infer<typeof scheduleSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
