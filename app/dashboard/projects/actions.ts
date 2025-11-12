"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { toSlug } from "@/lib/utils"

export async function createProject(formData: FormData) {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) throw new Error("Faça login para criar um projeto")
  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim() || null
  const image_url = String(formData.get("image_url") || "").trim() || null
  if (!title || title.length < 2) throw new Error("Título inválido")
  const slug = toSlug(title)
  await prisma.project.create({ data: { user_id: userId, title, description, image_url, slug } })
  revalidatePath("/dashboard/projects")
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get("id") || "")
  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim() || null
  const image_url = String(formData.get("image_url") || "").trim() || null
  if (!id) throw new Error("ID inválido")
  if (!title || title.length < 2) throw new Error("Título inválido")
  const slug = toSlug(title)
  await prisma.project.update({ where: { id }, data: { title, description, image_url, slug } })
  revalidatePath("/dashboard/projects")
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) throw new Error("ID inválido")
  await prisma.project.delete({ where: { id } })
  revalidatePath("/dashboard/projects")
}
