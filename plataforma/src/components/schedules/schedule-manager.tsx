'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarClock, Loader2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface ClientOption {
  id: string
  name: string
}
interface Schedule {
  id: string
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
  channels: string[]
  recipients: string[]
  includeAi: boolean
  isActive: boolean
  nextRunAt: string | null
  client: { name: string }
}

const FREQ: Record<string, string> = { DAILY: 'Diário', WEEKLY: 'Semanal', MONTHLY: 'Mensal' }
const CHANNELS = [
  { value: 'EMAIL', label: 'E-mail' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'LINK', label: 'Link' },
]

export function ScheduleManager({ clients, schedules }: { clients: ClientOption[]; schedules: Schedule[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const channels = CHANNELS.filter((c) => form.get(`ch_${c.value}`)).map((c) => c.value)
    const recipients = String(form.get('recipients') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const payload = {
      clientId: String(form.get('clientId')),
      frequency: String(form.get('frequency')),
      channels,
      recipients,
      includeAi: !!form.get('includeAi'),
    }
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || data.error) {
      setError(data.error || 'Não foi possível criar o agendamento.')
      return
    }
    ;(e.target as HTMLFormElement).reset()
    router.refresh()
  }

  async function toggle(s: Schedule) {
    await fetch(`/api/schedules/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !s.isActive }),
    })
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Remover este agendamento?')) return
    await fetch(`/api/schedules/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-4 w-4 text-primary" /> Novo agendamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Select id="clientId" name="clientId" required defaultValue="">
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
              <Label htmlFor="frequency">Frequência</Label>
              <Select id="frequency" name="frequency" defaultValue="MONTHLY">
                <option value="DAILY">Diário</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensal</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Canais</Label>
              <div className="flex gap-3">
                {CHANNELS.map((c) => (
                  <label key={c.value} className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" name={`ch_${c.value}`} defaultChecked={c.value !== 'WHATSAPP'} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipients">Destinatários (separados por vírgula)</Label>
              <Input id="recipients" name="recipients" placeholder="cliente@email.com, 5511999999999" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="includeAi" defaultChecked className="h-4 w-4 accent-[hsl(var(--primary))]" />
              Incluir análise com IA
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading || clients.length === 0} className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar agendamento
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Agendamentos ativos ({schedules.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {schedules.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nenhum agendamento. Crie um ao lado.</p>
          ) : (
            <div className="divide-y divide-border">
              {schedules.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-medium">{s.client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {FREQ[s.frequency]} · {s.channels.join(', ')} · {s.recipients.length} destinatário(s)
                      {s.includeAi ? ' · IA' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggle(s)}>
                      <Badge variant={s.isActive ? 'success' : 'secondary'}>
                        {s.isActive ? 'Ativo' : 'Pausado'}
                      </Badge>
                    </button>
                    <Button variant="ghost" size="icon" onClick={() => remove(s.id)} aria-label="Remover">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
