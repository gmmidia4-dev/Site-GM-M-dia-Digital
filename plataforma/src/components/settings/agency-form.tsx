'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AgencyData {
  name: string
  website: string | null
  phone: string | null
  logoUrl: string | null
  brandPrimary: string
  brandSecondary: string
}

export function AgencyForm({ agency }: { agency: AgencyData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [primary, setPrimary] = useState(agency.brandPrimary)
  const [secondary, setSecondary] = useState(agency.brandSecondary)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name')),
      website: String(form.get('website') || ''),
      phone: String(form.get('phone') || ''),
      logoUrl: String(form.get('logoUrl') || ''),
      brandPrimary: primary,
      brandSecondary: secondary,
    }
    const res = await fetch('/api/agency', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || data.error) {
      setError(data.error || 'Não foi possível salvar.')
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Identidade da agência (white-label)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da agência</Label>
            <Input id="name" name="name" defaultValue={agency.name} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Site</Label>
              <Input id="website" name="website" type="url" defaultValue={agency.website ?? ''} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" defaultValue={agency.phone ?? ''} placeholder="(11) 99999-9999" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL do logo</Label>
            <Input id="logoUrl" name="logoUrl" type="url" defaultValue={agency.logoUrl ?? ''} placeholder="https://…/logo.png" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brandPrimary">Cor primária</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input value={primary} onChange={(e) => setPrimary(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandSecondary">Cor secundária</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input value={secondary} onChange={(e) => setSecondary(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-lg p-4 text-white" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            <p className="text-sm opacity-80">Prévia do cabeçalho do relatório</p>
            <p className="text-lg font-bold">{agency.name}</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {saved && <p className="text-sm text-success">Alterações salvas ✓</p>}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
