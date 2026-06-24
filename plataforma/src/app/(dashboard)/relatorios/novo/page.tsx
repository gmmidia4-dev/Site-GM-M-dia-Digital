'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface ClientOption {
  id: string
  name: string
}

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

const PRESETS: Record<string, { label: string; period: string; days: number }> = {
  LAST_7: { label: 'Últimos 7 dias', period: 'WEEKLY', days: 7 },
  LAST_30: { label: 'Últimos 30 dias', period: 'MONTHLY', days: 30 },
  LAST_90: { label: 'Últimos 90 dias', period: 'CUSTOM', days: 90 },
}

export default function NewReportPage() {
  const router = useRouter()
  const search = useSearchParams()
  const [clients, setClients] = useState<ClientOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preset, setPreset] = useState('LAST_30')
  const [start, setStart] = useState(isoDaysAgo(30))
  const [end, setEnd] = useState(isoDaysAgo(0))
  const [includeAi, setIncludeAi] = useState(true)

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setClients([]))
  }, [])

  function applyPreset(key: string) {
    setPreset(key)
    const p = PRESETS[key]
    if (p) {
      setStart(isoDaysAgo(p.days))
      setEnd(isoDaysAgo(0))
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      clientId: String(form.get('clientId')),
      title: String(form.get('title')),
      period: PRESETS[preset]?.period ?? 'CUSTOM',
      startDate: start,
      endDate: end,
      includeAi,
    }
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || data.error) {
      setError(data.error || 'Não foi possível gerar o relatório.')
      return
    }
    router.push(`/relatorios/${data.id}`)
  }

  return (
    <>
      <PageHeader title="Novo relatório" description="Selecione o cliente e o período. Os dados são sincronizados e analisados automaticamente." />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Select id="clientId" name="clientId" defaultValue={search.get('clientId') ?? ''} required>
                <option value="" disabled>
                  Selecione um cliente
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              {clients.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum cliente. Cadastre um cliente antes de gerar relatórios.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" placeholder="Relatório mensal — Junho/2026" required />
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      preset === key ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Início</Label>
                <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">Fim</Label>
                <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} required />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm">
              <input type="checkbox" checked={includeAi} onChange={(e) => setIncludeAi(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" />
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Incluir análise com Inteligência Artificial
              </span>
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading || clients.length === 0}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Gerando relatório…' : 'Gerar relatório'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
