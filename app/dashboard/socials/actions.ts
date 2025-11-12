"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createSocial(formData: FormData) {
  const portfolio_id = String(formData.get("portfolio_id") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const url = String(formData.get("url") || "").trim()
  if (!portfolio_id) throw new Error("Selecione um portfólio")
  if (!name || !url) throw new Error("Informe nome e URL")
  await prisma.socialLink.create({ data: { portfolio_id, name, url } })
  revalidatePath("/dashboard/socials")
}

export async function updateSocial(formData: FormData) {
  const id = String(formData.get("id") || "")
  const name = String(formData.get("name") || "").trim()
  const url = String(formData.get("url") || "").trim()
  if (!id) throw new Error("ID inválido")
  if (!name || !url) throw new Error("Informe nome e URL")
  await prisma.socialLink.update({ where: { id }, data: { name, url } })
  revalidatePath("/dashboard/socials")
}

export async function deleteSocial(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) throw new Error("ID inválido")
  await prisma.socialLink.delete({ where: { id } })
  revalidatePath("/dashboard/socials")
}
