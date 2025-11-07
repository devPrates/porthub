"use client"

import * as React from "react"
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, LabelList, Tooltip } from "recharts"

type Item = {
  key: string
  label: string
  value: number
  color?: string
}

export function MiniBarSpark({ items, className }: { items: Item[]; className?: string }) {
  const PRIMARY_VIOLET = "#8b5cf6" // violet-500
  const data = items.map((i) => ({ key: i.key, label: i.label, value: i.value, fill: i.color ?? PRIMARY_VIOLET }))

  return (
    <div className={className ?? "h-10 w-44"} aria-label="Resumo em gráfico de barras">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 6 }} barCategoryGap="25%">
          <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            <LabelList dataKey="value" position="top" fontSize={10} />
            {data.map((item) => (
              <Cell key={item.key} fill={item.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MiniBarSpark