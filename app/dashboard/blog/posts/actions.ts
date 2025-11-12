"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { toSlug } from "@/lib/utils"
export async function createPost(formData: FormData) {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) throw new Error("Faça login para criar posts")
  let blog = await prisma.blog.findFirst({ where: { user_id: userId } })
  if (!blog) blog = await prisma.blog.create({ data: { user_id: userId, title: "Meu Blog" } })
  const title = String(formData.get("title") || "").trim()
  const category_id = String(formData.get("category_id") || "").trim() || null
  const description = String(formData.get("description") || "").trim() || null
  const image_url = String(formData.get("image_url") || "").trim() || null
  if (!title) throw new Error("Informe o título")
  const slug = toSlug(title)
  await prisma.post.create({ data: { blog_id: blog.id, title, slug, category_id, description, image_url } })
  revalidatePath("/dashboard/blog/posts")
}
