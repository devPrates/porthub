import { ReactNode } from "react"
import { Layout as LayoutIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroBannerProps {
  title: string
  subtitle?: string
  rightIcon?: ReactNode
  className?: string
}

export default function HeroBanner({ title, subtitle, rightIcon, className }: HeroBannerProps) {
  return (
    <div className={cn("mt-6 md:mt-8 rounded-xl border p-8 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600">
          {rightIcon ?? <LayoutIcon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  )
}