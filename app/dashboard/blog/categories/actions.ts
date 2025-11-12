"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { toSlug } from "@/lib/utils"
export async function createCategory(formData: FormData) {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) throw new Error("Faça login para criar categorias")
  let blog = await prisma.blog.findFirst({ where: { user_id: userId } })
  if (!blog) blog = await prisma.blog.create({ data: { user_id: userId, title: "Meu Blog" } })
  const name = String(formData.get("name") || "").trim()
  if (!name) throw new Error("Informe o nome")
  const slug = toSlug(name)
  await prisma.category.create({ data: { blog_id: blog.id, name, slug } })
  revalidatePath("/dashboard/blog/categories")
}
