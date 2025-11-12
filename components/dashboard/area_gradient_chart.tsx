"use client"
import * as React from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, LabelList, Cell } from "recharts"

type Item = { key: string; label: string; value: number; color?: string }

export default function AreaGradientChart({ items, className }: { items: Item[]; className?: string }) {
  const id = React.useId().replace(/:/g, "")
  const PRIMARY = "#8b5cf6"
  const data = items.map((i) => ({ key: i.key, label: i.label, value: i.value, fill: i.color ?? PRIMARY }))
  const maxValue = Math.max(0, ...items.map((i) => i.value))
  const maxTick = Math.max(5, Math.ceil(maxValue / 5) * 5)
  const yTicks = Array.from({ length: maxTick / 5 + 1 }, (_, i) => i * 5)
  const config = items.reduce((acc, i) => {
    acc[i.key] = { label: i.label, color: i.color ?? PRIMARY }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <ChartContainer config={config} className={className ?? "h-[180px] w-full"}>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.45} />
            <stop offset="95%" stopColor={PRIMARY} stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </svg>
      <AreaChart data={data} margin={{ left: 16, right: 16, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} tick={{ fontWeight: 600 }} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} ticks={yTicks} domain={[0, maxTick]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area type="monotone" dataKey="value" stroke={PRIMARY} fill={`url(#gradient-${id})`}>
          <LabelList dataKey="value" position="top" />
          {data.map((d) => (
            <Cell key={d.key} fill={d.fill} />
          ))}
        </Area>
      </AreaChart>
    </ChartContainer>
  )
}
