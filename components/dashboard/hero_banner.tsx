"use client"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import {
  Layout as LayoutIcon,
  Home,
  FolderKanban,
  Briefcase,
  Building,
  Award,
  Share2,
  FileText,
  BookOpen,
  Tags,
  Code2,
  User as UserIcon,
  Key,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroBannerProps {
  title: string
  subtitle?: string
  rightIcon?: ReactNode
  className?: string
}

export default function HeroBanner({ title, subtitle, rightIcon, className }: HeroBannerProps) {
  const pathname = usePathname()
  const mapping = [
    { path: "/dashboard/settings/api-keys", icon: Key },
    { path: "/dashboard/settings/profile", icon: UserIcon },
    { path: "/dashboard/admin/users", icon: UserIcon },
    { path: "/dashboard/portfolio/projects", icon: FolderKanban },
    { path: "/dashboard/portfolio/experiences", icon: Briefcase },
    { path: "/dashboard/portfolio/companies", icon: Building },
    { path: "/dashboard/portfolio/certificates", icon: Award },
    { path: "/dashboard/portfolio/socials", icon: Share2 },
    { path: "/dashboard/portfolio/pages", icon: FileText },
    { path: "/dashboard/portfolio", icon: LayoutIcon },
    { path: "/dashboard/blog/posts", icon: BookOpen },
    { path: "/dashboard/blog/categories", icon: Tags },
    { path: "/dashboard/technologies", icon: Code2 },
    { path: "/dashboard", icon: Home },
  ].sort((a, b) => b.path.length - a.path.length)
  const AutoIcon = mapping.find((m) => pathname?.startsWith(m.path))?.icon ?? LayoutIcon
  return (
    <div className={cn("mt-6 md:mt-8 rounded-xl border p-8 bg-linear-to-br from-indigo-500/10 via-transparent to-purple-500/10", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600">
          {rightIcon ?? <AutoIcon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  )
}
