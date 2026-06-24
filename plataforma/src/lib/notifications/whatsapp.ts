/**
 * Envio via WhatsApp Cloud API (Meta).
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 * Em modo demo (sem token) apenas registra no log.
 */
export interface WhatsAppParams {
  to: string // E.164, ex.: 5511999999999
  clientName: string
  periodLabel: string
  shareUrl: string
}

export async function sendReportWhatsApp(params: WhatsAppParams): Promise<{ ok: boolean }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneId) {
    console.log(`[whatsapp:demo] Para ${params.to} — ${params.clientName}: ${params.shareUrl}`)
    return { ok: true }
  }

  const to = params.to.replace(/\D/g, '')
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME || 'relatorio_pronto',
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: params.clientName },
              { type: 'text', text: params.periodLabel },
              { type: 'text', text: params.shareUrl },
            ],
          },
        ],
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`WhatsApp falhou: ${res.status} ${body}`)
  }
  return { ok: true }
}
