"use client"
import type * as React from "react"
import StatsBarChart from "@/components/dashboard/stats_bar_chart"
import MiniBarSpark from "@/components/dashboard/mini_bar_spark"

type Item = { key: string; label: string; value: number; color?: string }

export default function ChartBarLabel({ items, variant = "wide", className }: { items: Item[]; variant?: "compact" | "wide"; className?: string }) {
  if (variant === "compact") {
    return <MiniBarSpark items={items} className={className} />
  }
  return <StatsBarChart items={items} className={className} />
}
