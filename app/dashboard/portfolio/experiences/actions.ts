"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
export async function createExperience(formData: FormData) {
  const portfolio_id = String(formData.get("portfolio_id") || "").trim()
  const title = String(formData.get("title") || "").trim()
  const subtitle = String(formData.get("subtitle") || "").trim() || null
  const description = String(formData.get("description") || "").trim() || null
  if (!portfolio_id) throw new Error("Selecione um portfólio")
  if (!title || title.length < 2) throw new Error("Título inválido")
  await prisma.experience.create({ data: { portfolio_id, title, subtitle, description } })
  revalidatePath("/dashboard/portfolio/experiences")
}
export async function updateExperience(formData: FormData) {
  const id = String(formData.get("id") || "")
  const title = String(formData.get("title") || "").trim()
  const subtitle = String(formData.get("subtitle") || "").trim() || null
  const description = String(formData.get("description") || "").trim() || null
  if (!id) throw new Error("ID inválido")
  if (!title || title.length < 2) throw new Error("Título inválido")
  await prisma.experience.update({ where: { id }, data: { title, subtitle, description } })
  revalidatePath("/dashboard/portfolio/experiences")
}
export async function deleteExperience(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) throw new Error("ID inválido")
  await prisma.experience.delete({ where: { id } })
  revalidatePath("/dashboard/portfolio/experiences")
}
