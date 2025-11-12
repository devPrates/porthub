"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
export async function createPage(formData: FormData) {
  const portfolio_id = String(formData.get("portfolio_id") || "").trim()
  const title = String(formData.get("title") || "").trim()
  const slugInput = String(formData.get("slug") || "").trim()
  const slug = toSlug(slugInput || title)
  if (!portfolio_id) throw new Error("Selecione um portfólio")
  if (!title) throw new Error("Informe o título")
  await prisma.page.create({ data: { portfolio_id, title, slug } })
  revalidatePath("/dashboard/pages")
}
