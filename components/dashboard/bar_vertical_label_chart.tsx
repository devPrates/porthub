"use client"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, LabelList, XAxis, YAxis, Cell } from "recharts"

type Item = { key: string; label: string; value: number; color?: string }

export default function BarVerticalLabelChart({ items, className, max = 5 }: { items: Item[]; className?: string; max?: number }) {
  const PRIMARY = "#8b5cf6"
  const data = items.map((i) => ({ key: i.key, label: i.label, value: i.value, fill: i.color ?? PRIMARY }))
  const xTicks = Array.from({ length: Math.max(1, Math.floor(max)) + 1 }, (_, i) => i)
  const config = {
    bar: { color: PRIMARY },
    label: { color: "var(--background)" },
  } as const

  function renderLabelLeft(props: any) {
    const x = props.x + 8
    const y = props.y + props.height / 2
    return (
      <text x={x} y={y} dominantBaseline="middle" className="fill-(--color-label)" fontSize={12}>
        {props.value}
      </text>
    )
  }

  function renderLabelRight(props: any) {
    const x = props.x + props.width + 8
    const y = props.y + props.height / 2
    return (
      <text x={x} y={y} dominantBaseline="middle" className="fill-foreground" fontSize={12} fontWeight={700}>
        {props.value}
      </text>
    )
  }

  return (
    <ChartContainer config={config} className={className ?? "h-[180px] w-full"}>
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ right: 16 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="label" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
        <XAxis dataKey="value" type="number" hide ticks={xTicks} domain={[0, max]} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="value" layout="vertical" fill="var(--color-bar)" radius={4}>
          <LabelList dataKey="label" position="insideLeft" content={renderLabelLeft} />
          <LabelList dataKey="value" position="right" content={renderLabelRight} />
          {data.map((d) => (
            <Cell key={d.key} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
