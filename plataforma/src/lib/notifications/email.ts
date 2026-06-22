import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface ReportEmailParams {
  to: string
  clientName: string
  periodLabel: string
  shareUrl: string
  agencyName: string
  primaryColor: string
}

/** Envia o e-mail com o link do relatório. Em modo demo apenas registra no log. */
export async function sendReportEmail(params: ReportEmailParams): Promise<{ ok: boolean; id?: string }> {
  const html = reportEmailHtml(params)

  if (!resend) {
    console.log(`[email:demo] Para ${params.to} — ${params.clientName} (${params.periodLabel}) → ${params.shareUrl}`)
    return { ok: true, id: 'demo' }
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Reportia <relatorios@example.com>',
    to: params.to,
    subject: `📊 Relatório ${params.clientName} — ${params.periodLabel}`,
    html,
  })
  if (error) throw new Error(error.message)
  return { ok: true, id: data?.id }
}

function reportEmailHtml(p: ReportEmailParams): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:${p.primaryColor};padding:24px;color:#fff">
        <div style="font-size:13px;opacity:.85">${p.agencyName}</div>
        <div style="font-size:20px;font-weight:bold;margin-top:4px">Seu relatório está pronto</div>
      </div>
      <div style="padding:24px;color:#374151;font-size:14px;line-height:1.6">
        <p>Olá! O relatório de tráfego pago de <b>${p.clientName}</b> referente a <b>${p.periodLabel}</b> já está disponível.</p>
        <p style="text-align:center;margin:28px 0">
          <a href="${p.shareUrl}" style="background:${p.primaryColor};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;display:inline-block">Ver relatório</a>
        </p>
        <p style="font-size:12px;color:#9ca3af">Ou copie o link: ${p.shareUrl}</p>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">Enviado por ${p.agencyName} via Reportia</p>
  </div></body></html>`
}
