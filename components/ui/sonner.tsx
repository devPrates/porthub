"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system", resolvedTheme } = useTheme()

  // Tons customizados:
  // - Success: emerald (coerente com o chip de USER)
  // - Error: rose (coerente com o botão de deletar)
  const successColors =
    resolvedTheme === "dark"
      ? {
          bg: "rgba(16,185,129,0.15)", // emerald-500 com alpha
          border: "#10B981", // emerald-500
          text: "#A7F3D0", // emerald-200
        }
      : {
          bg: "#D1FAE5", // emerald-100
          border: "#10B981", // emerald-500
          text: "#047857", // emerald-700
        }

  const errorColors =
    resolvedTheme === "dark"
      ? {
          bg: "rgba(244,63,94,0.15)", // rose-500 com alpha
          border: "#F43F5E", // rose-500
          text: "#FCA5A5", // rose-300
        }
      : {
          bg: "#FEE2E2", // rose-100
          border: "#F43F5E", // rose-500
          text: "#9F1239", // rose-700
        }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        // Tema normal segue tokens do design system
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",

        // Tons customizados para estados success e error
        "--success-bg": successColors.bg,
        "--success-border": successColors.border,
        "--success-text": successColors.text,
        "--error-bg": errorColors.bg,
        "--error-border": errorColors.border,
        "--error-text": errorColors.text,
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }
