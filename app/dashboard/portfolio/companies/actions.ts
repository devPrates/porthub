"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
export async function createCompany(formData: FormData) {
  const experience_id = String(formData.get("experience_id") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const role_name = String(formData.get("role_name") || "").trim()
  const image_url = String(formData.get("image_url") || "").trim() || null
  const date_start_raw = String(formData.get("date_start") || "").trim()
  const date_start = date_start_raw ? new Date(date_start_raw) : null
  if (!experience_id) throw new Error("Selecione uma experiência")
  if (!name || !role_name) throw new Error("Informe nome e cargo")
  await prisma.company.create({ data: { experience_id, name, role_name, image_url, date_start: date_start ?? undefined } })
  revalidatePath("/dashboard/portfolio/companies")
}
export async function updateCompany(formData: FormData) {
  const id = String(formData.get("id") || "")
  const name = String(formData.get("name") || "").trim()
  const role_name = String(formData.get("role_name") || "").trim()
  const image_url = String(formData.get("image_url") || "").trim() || null
  const date_start_raw = String(formData.get("date_start") || "").trim()
  const date_start = date_start_raw ? new Date(date_start_raw) : null
  if (!id) throw new Error("ID inválido")
  if (!name || !role_name) throw new Error("Informe nome e cargo")
  await prisma.company.update({ where: { id }, data: { name, role_name, image_url, date_start: date_start ?? undefined } })
  revalidatePath("/dashboard/portfolio/companies")
}
export async function deleteCompany(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) throw new Error("ID inválido")
  await prisma.company.delete({ where: { id } })
  revalidatePath("/dashboard/portfolio/companies")
}
