'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface ClientFormData {
  id?: string
  name?: string
  segment?: string | null
  brandPrimary?: string | null
  logoUrl?: string | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
}

export function ClientForm({ client }: { client?: ClientFormData }) {
  const router = useRouter()
  const isEdit = Boolean(client?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    const res = await fetch(isEdit ? `/api/clients/${client!.id}` : '/api/clients', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || data.error) {
      setError(data.error || 'Não foi possível salvar o cliente.')
      return
    }
    router.push(`/clientes/${data.id ?? client!.id}`)
    router.refresh()
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do cliente *</Label>
            <Input id="name" name="name" defaultValue={client?.name ?? ''} placeholder="Empresa do Cliente Ltda." required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input id="segment" name="segment" defaultValue={client?.segment ?? ''} placeholder="E-commerce, Saúde…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandPrimary">Cor da marca</Label>
              <Input id="brandPrimary" name="brandPrimary" defaultValue={client?.brandPrimary ?? ''} placeholder="#6366F1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL do logo</Label>
            <Input id="logoUrl" name="logoUrl" type="url" defaultValue={client?.logoUrl ?? ''} placeholder="https://…/logo.png" />
          </div>
          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium">Contato</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nome</Label>
                <Input id="contactName" name="contactName" defaultValue={client?.contactName ?? ''} placeholder="Responsável" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-mail</Label>
                <Input id="contactEmail" name="contactEmail" type="email" defaultValue={client?.contactEmail ?? ''} placeholder="contato@cliente.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">WhatsApp</Label>
                <Input id="contactPhone" name="contactPhone" defaultValue={client?.contactPhone ?? ''} placeholder="5511999999999" />
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Cadastrar cliente'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
