"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? "Alternar para modo claro" : "Alternar para modo escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className={`size-4 ${isDark ? "hidden" : ""}`} />
      <Moon className={`size-4 ${isDark ? "" : "hidden"}`} />
    </Button>
  )
}