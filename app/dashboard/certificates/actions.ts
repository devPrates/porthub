"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
export async function createCertificate(formData: FormData) {
  const experience_id = String(formData.get("experience_id") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const type = String(formData.get("type") || "").trim()
  const hours = Number(String(formData.get("hours") || "").trim() || "0")
  const date_end_raw = String(formData.get("date_end") || "").trim()
  const date_end = date_end_raw ? new Date(date_end_raw) : null
  if (!experience_id) throw new Error("Selecione uma experiência")
  if (!name) throw new Error("Informe o nome")
  const slug = toSlug(name)
  await prisma.certificate.create({ data: { experience_id, name, slug, type: type as any, hours: hours || null, date_end } })
  revalidatePath("/dashboard/certificates")
}
export async function updateCertificate(formData: FormData) {
  const id = String(formData.get("id") || "")
  const name = String(formData.get("name") || "").trim()
  const type = String(formData.get("type") || "").trim()
  const hours = Number(String(formData.get("hours") || "").trim() || "0")
  const date_end_raw = String(formData.get("date_end") || "").trim()
  const date_end = date_end_raw ? new Date(date_end_raw) : null
  if (!id) throw new Error("ID inválido")
  if (!name) throw new Error("Informe o nome")
  const slug = toSlug(name)
  await prisma.certificate.update({ where: { id }, data: { name, slug, type: type as any, hours: hours || null, date_end } })
  revalidatePath("/dashboard/certificates")
}
export async function deleteCertificate(formData: FormData) {
  const id = String(formData.get("id") || "")
  if (!id) throw new Error("ID inválido")
  await prisma.certificate.delete({ where: { id } })
  revalidatePath("/dashboard/certificates")
}
