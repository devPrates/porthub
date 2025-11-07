"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type BackButtonProps = {
  label?: string
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
  className?: string
}

export function BackButton({ label = "Voltar", size = "default", className }: BackButtonProps) {
  const router = useRouter()
  return (
    <Button
      size={size}
      className={className}
      onClick={() => router.back()}
      aria-label="Voltar para a página anterior"
    >
      <ArrowLeft />
      <span>{label}</span>
    </Button>
  )
}