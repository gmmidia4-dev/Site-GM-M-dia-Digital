'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Download, Mail, MessageCircle, RefreshCw, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl } from '@/lib/utils'

interface ReportActionsProps {
  reportId: string
  shareToken: string | null
  defaultEmail?: string | null
  defaultPhone?: string | null
}

export function ReportActions({ reportId, shareToken, defaultEmail, defaultPhone }: ReportActionsProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const shareUrl = shareToken ? appUrl(`/r/${shareToken}`) : ''

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  async function send(channel: 'EMAIL' | 'WHATSAPP') {
    const recipient = channel === 'EMAIL' ? defaultEmail : defaultPhone
    if (!recipient) {
      setMessage(`Cadastre o ${channel === 'EMAIL' ? 'e-mail' : 'telefone'} do cliente para enviar.`)
      return
    }
    setBusy(channel)
    setMessage('')
    const res = await fetch(`/api/reports/${reportId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channels: [channel], recipients: [recipient] }),
    })
    setBusy(null)
    setMessage(res.ok ? `Enviado por ${channel === 'EMAIL' ? 'e-mail' : 'WhatsApp'} ✓` : 'Falha no envio.')
  }

  async function regenerate() {
    setBusy('regen')
    await fetch(`/api/reports/${reportId}/generate`, { method: 'POST' })
    setBusy(null)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={copyLink} disabled={!shareToken}>
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copiado' : 'Copiar link'}
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={`/api/reports/${reportId}/pdf`} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" /> PDF
          </a>
        </Button>
        <Button variant="outline" size="sm" onClick={() => send('EMAIL')} disabled={busy === 'EMAIL'}>
          <Mail className="h-4 w-4" /> E-mail
        </Button>
        <Button variant="secondary" size="sm" onClick={() => send('WHATSAPP')} disabled={busy === 'WHATSAPP'}>
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </Button>
        <Button size="sm" onClick={regenerate} disabled={busy === 'regen'}>
          {busy === 'regen' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Atualizar
        </Button>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  )
}
