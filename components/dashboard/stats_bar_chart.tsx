"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts"
import * as React from "react"

type Item = {
  key: string
  label: string
  value: number
  color?: string // optional, overridden to primary
}

export function StatsBarChart({ items, className }: { items: Item[]; className?: string }) {
  const PRIMARY_VIOLET = "#8b5cf6" // Tailwind violet-500

  // Build Y-axis ticks from 0 to next multiple of 5 of max value
  const maxValue = Math.max(0, ...items.map((i) => i.value))
  const maxTick = Math.max(5, Math.ceil(maxValue / 5) * 5)
  const yTicks = Array.from({ length: maxTick / 5 + 1 }, (_, i) => i * 5)

  const chartData = items.map((item) => ({
    key: item.key,
    label: item.label,
    value: item.value,
    fill: PRIMARY_VIOLET,
  }))

  const chartConfig = items.reduce(
    (acc, item) => {
      acc[item.key] = { label: item.label, color: PRIMARY_VIOLET }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <ChartContainer
      config={chartConfig}
      className={className ?? "aspect-auto w-fit [&_.recharts-cartesian-axis-tick_text]:font-semibold"}
      style={{ width: Math.max(items.length * 88, 280) }}
    >
      <BarChart data={chartData} margin={{ left: 16, right: 16, bottom: 32 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} tick={{ fontWeight: 700 }} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} ticks={yTicks} domain={[0, maxTick]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          <LabelList dataKey="value" position="top" />
          {chartData.map((item) => (
            <Cell key={item.key} fill={item.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default StatsBarChart