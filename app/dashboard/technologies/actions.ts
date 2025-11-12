"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
export async function createTechnology(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  if (!name) throw new Error("Informe o nome")
  const slug = toSlug(name)
  await prisma.technology.create({ data: { name, slug } })
  revalidatePath("/dashboard/technologies")
}
