'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { PlatformBreakdown } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6']

export function PlatformDonut({ platforms }: { platforms: PlatformBreakdown[] }) {
  const data = platforms.map((p) => ({ name: p.label, value: p.metrics.spend }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 12,
            color: 'hsl(var(--popover-foreground))',
          }}
          formatter={(v: number, n) => [formatCurrency(v), n]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export { COLORS as PLATFORM_COLORS }
