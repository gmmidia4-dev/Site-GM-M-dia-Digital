'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plug } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface ClientOption {
  id: string
  name: string
}

const PLATFORMS = [
  { value: 'META_ADS', label: 'Meta Ads' },
  { value: 'GOOGLE_ADS', label: 'Google Ads' },
  { value: 'TIKTOK_ADS', label: 'TikTok Ads' },
  { value: 'LINKEDIN_ADS', label: 'LinkedIn Ads' },
  { value: 'GA4', label: 'Google Analytics 4' },
  { value: 'SEARCH_CONSOLE', label: 'Search Console' },
]

export function ConnectForm({ clients, defaultClientId }: { clients: ClientOption[]; defaultClientId?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      clientId: String(form.get('clientId')),
      platform: String(form.get('platform')),
      externalAccountId: String(form.get('externalAccountId')),
      accountName: String(form.get('accountName') || ''),
    }
    const res = await fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || data.error) {
      setError(data.error || 'Não foi possível conectar.')
      return
    }
    router.refresh()
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plug className="h-4 w-4 text-primary" /> Conectar conta de anúncios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select id="clientId" name="clientId" defaultValue={defaultClientId ?? ''} required>
              <option value="" disabled>
                Selecione
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Plataforma</Label>
            <Select id="platform" name="platform" required>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="externalAccountId">ID da conta</Label>
            <Input id="externalAccountId" name="externalAccountId" placeholder="act_1234567890 / 123-456-7890" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Apelido (opcional)</Label>
            <Input id="accountName" name="accountName" placeholder="Conta principal" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading || clients.length === 0} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Conectar
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Em produção, use o botão “Conectar via OAuth” de cada plataforma. Em modo demo, os
            dados são sintéticos.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
