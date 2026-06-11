import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface LeadEmailData {
  name: string
  email: string
  phone: string
  company?: string
  service?: string
  message?: string
}

interface ContactEmailData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function sendLeadNotification(data: LeadEmailData): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL || 'contato@gmmidia.com.br'

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Novo Lead - GM Mídia Digital</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #0F0F0F; color: #E2E8F0; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 12px; overflow: hidden; border: 1px solid #2A2A2A;">
        <div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 30px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">🎯 Novo Lead Recebido!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">GM Mídia Digital</p>
        </div>
        <div style="padding: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF; width: 120px;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0; font-weight: 600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0;">
                <a href="mailto:${data.email}" style="color: #6366F1;">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Telefone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0;">
                <a href="https://wa.me/55${data.phone.replace(/\D/g, '')}" style="color: #10B981;">${data.phone}</a>
              </td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Empresa</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0;">${data.company}</td>
            </tr>` : ''}
            ${data.service ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Serviço</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0;">${data.service}</td>
            </tr>` : ''}
            ${data.message ? `
            <tr>
              <td style="padding: 10px 0; color: #9CA3AF; vertical-align: top;">Mensagem</td>
              <td style="padding: 10px 0; color: #E2E8F0;">${data.message}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/leads"
               style="display: inline-block; background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Ver no Painel Admin
            </a>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; border-top: 1px solid #2A2A2A; color: #6B7280; font-size: 12px;">
          GM Mídia Digital · contato@gmmidia.com.br
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"GM Mídia Digital" <${process.env.SMTP_USER || 'contato@gmmidia.com.br'}>`,
    to,
    subject: `🎯 Novo Lead: ${data.name} - ${data.service || 'Diagnóstico Gratuito'}`,
    html,
  })
}

export async function sendLeadConfirmation(data: LeadEmailData): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recebemos seu contato - GM Mídia Digital</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #0F0F0F; color: #E2E8F0; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 12px; overflow: hidden; border: 1px solid #2A2A2A;">
        <div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 40px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 800;">GM Mídia Digital</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 16px;">Transformamos Tráfego em Vendas com IA</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #FFFFFF; margin: 0 0 16px; font-size: 22px;">Olá, ${data.name}! 👋</h2>
          <p style="color: #9CA3AF; line-height: 1.6; margin-bottom: 16px;">
            Recebemos sua solicitação de diagnóstico gratuito e ficamos muito felizes com seu interesse!
          </p>
          <p style="color: #9CA3AF; line-height: 1.6; margin-bottom: 24px;">
            Nossa equipe entrará em contato com você em até <strong style="color: #10B981;">2 horas úteis</strong>
            para agendar uma conversa e entender melhor o seu negócio.
          </p>
          <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #E2E8F0; margin: 0 0 8px; font-weight: 600;">O que acontece agora:</p>
            <ul style="color: #9CA3AF; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Nossa equipe analisa seu perfil</li>
              <li>Entramos em contato via WhatsApp ou email</li>
              <li>Agendamos uma chamada de diagnóstico gratuita</li>
              <li>Apresentamos uma proposta personalizada</li>
            </ul>
          </div>
          <div style="text-align: center;">
            <a href="https://wa.me/5511999999999?text=Olá!%20Acabei%20de%20preencher%20o%20formulário%20no%20site%20e%20gostaria%20de%20saber%20mais."
               style="display: inline-block; background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              💬 Falar no WhatsApp Agora
            </a>
          </div>
        </div>
        <div style="padding: 20px; text-align: center; border-top: 1px solid #2A2A2A; color: #6B7280; font-size: 12px;">
          <p style="margin: 0;">GM Mídia Digital · <a href="mailto:contato@gmmidia.com.br" style="color: #6366F1;">contato@gmmidia.com.br</a></p>
          <p style="margin: 8px 0 0;">+55 (11) 99999-9999</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"GM Mídia Digital" <${process.env.SMTP_USER || 'contato@gmmidia.com.br'}>`,
    to: data.email,
    subject: '✅ Recebemos seu contato! Em breve retornamos - GM Mídia Digital',
    html,
  })
}

export async function sendContactNotification(data: ContactEmailData): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL || 'contato@gmmidia.com.br'

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Nova Mensagem de Contato - GM Mídia Digital</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #0F0F0F; color: #E2E8F0; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 12px; overflow: hidden; border: 1px solid #2A2A2A;">
        <div style="background: linear-gradient(135deg, #6366F1, #8B5CF6); padding: 30px; text-align: center;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">✉️ Nova Mensagem de Contato</h1>
        </div>
        <div style="padding: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF; width: 100px;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0; font-weight: 600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A;">
                <a href="mailto:${data.email}" style="color: #6366F1;">${data.email}</a>
              </td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Telefone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0;">${data.phone}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #9CA3AF;">Assunto</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #2A2A2A; color: #E2E8F0; font-weight: 600;">${data.subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #9CA3AF; vertical-align: top;">Mensagem</td>
              <td style="padding: 10px 0; color: #E2E8F0; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"GM Mídia Digital" <${process.env.SMTP_USER || 'contato@gmmidia.com.br'}>`,
    to,
    subject: `✉️ Contato: ${data.subject} - ${data.name}`,
    html,
    replyTo: data.email,
  })
}
