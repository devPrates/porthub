"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function createPortfolio(formData: FormData) {
  const session = await getSession()
  if (!session?.user || !(session.user as any).id) {
    throw new Error("Não autenticado. Faça login para criar um portfólio.")
  }

  const userId = (session.user as any).id as string

  const title = (formData.get("title") as string | null)?.trim() ?? ""
  const subtitle = (formData.get("subtitle") as string | null)?.trim() || null

  if (!title || title.length < 3) {
    throw new Error("Título é obrigatório e deve ter ao menos 3 caracteres.")
  }
  if (title.length > 120) {
    throw new Error("Título deve ter no máximo 120 caracteres.")
  }
  if (subtitle && subtitle.length > 180) {
    throw new Error("Subtítulo deve ter no máximo 180 caracteres.")
  }

  await prisma.portfolio.create({
    data: {
      user_id: userId,
      title,
      subtitle,
    },
  })

  revalidatePath("/dashboard/portfolios")
}
