"use client"
import * as React from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts"

type Item = { key: string; label: string; value: number; color?: string }

export default function BarCustomLabelChart({ items, className }: { items: Item[]; className?: string }) {
  const PRIMARY = "#8b5cf6"
  const data = items.map((i) => ({ key: i.key, label: i.label, value: i.value, fill: i.color ?? PRIMARY }))
  const maxValue = Math.max(0, ...items.map((i) => i.value))
  const maxTick = Math.max(5, Math.ceil(maxValue / 5) * 5)
  const yTicks = Array.from({ length: maxTick / 5 + 1 }, (_, i) => i * 5)
  const config = items.reduce((acc, i) => {
    acc[i.key] = { label: i.label, color: i.color ?? PRIMARY }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  function renderLabel(props: any) {
    const x = props.x + props.width / 2
    const y = props.y - 6
    return (
      <text x={x} y={y} textAnchor="middle" fill="currentColor" fontSize={12} fontWeight={700}>
        {props.value}
      </text>
    )
  }

  return (
    <ChartContainer config={config} className={className ?? "h-[180px] w-full"}>
      <BarChart data={data} margin={{ left: 16, right: 16, bottom: 24 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} tick={{ fontWeight: 700 }} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} ticks={yTicks} domain={[0, maxTick]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          <LabelList dataKey="value" content={renderLabel} />
          {data.map((item) => (
            <Cell key={item.key} fill={item.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
