import { prisma } from '@/lib/db'
import { appUrl } from '@/lib/utils'
import { sendReportEmail } from '@/lib/notifications/email'
import { sendReportWhatsApp } from '@/lib/notifications/whatsapp'
import type { DeliveryChannel } from '@prisma/client'

/**
 * Entrega um relatório pronto pelos canais informados, registrando cada tentativa
 * em ReportDelivery. Marca o relatório como SENT ao final.
 */
export async function deliverReport(reportId: string, channels: DeliveryChannel[], recipients: string[]) {
  const report = await prisma.report.findUniqueOrThrow({
    where: { id: reportId },
    include: { client: { include: { agency: true } } },
  })

  if (!report.shareToken) throw new Error('Relatório sem link de compartilhamento. Gere-o primeiro.')

  const shareUrl = appUrl(`/r/${report.shareToken}`)
  const periodLabel = (report.dataSnapshot as any)?.period?.label ?? report.title
  const primary = report.client.brandPrimary || report.client.agency.brandPrimary

  for (const channel of channels) {
    for (const recipient of recipients) {
      const delivery = await prisma.reportDelivery.create({
        data: { reportId, channel, recipient, status: 'PENDING' },
      })
      try {
        if (channel === 'EMAIL') {
          await sendReportEmail({
            to: recipient,
            clientName: report.client.name,
            periodLabel,
            shareUrl,
            agencyName: report.client.agency.name,
            primaryColor: primary,
          })
        } else if (channel === 'WHATSAPP') {
          await sendReportWhatsApp({ to: recipient, clientName: report.client.name, periodLabel, shareUrl })
        }
        // LINK: nada a enviar — o compartilhamento é o próprio shareUrl
        await prisma.reportDelivery.update({
          where: { id: delivery.id },
          data: { status: 'SENT', sentAt: new Date() },
        })
      } catch (err: any) {
        await prisma.reportDelivery.update({
          where: { id: delivery.id },
          data: { status: 'FAILED', error: String(err?.message ?? err) },
        })
      }
    }
  }

  await prisma.report.update({ where: { id: reportId }, data: { status: 'SENT' } })
  return { shareUrl }
}
