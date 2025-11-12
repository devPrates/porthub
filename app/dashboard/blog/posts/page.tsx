import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { toSlug } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { revalidatePath } from "next/cache"
import HeroBanner from "@/components/dashboard/hero_banner"
import CreateCard from "@/components/dashboard/create_card"
import { BookOpen, Trash2 } from "lucide-react"

export default async function BlogPostsPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>Faça login para gerenciar posts.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  let blog = await prisma.blog.findFirst({ where: { user_id: userId } })
  if (!blog) {
    blog = await prisma.blog.create({ data: { user_id: userId, title: "Meu Blog" } })
  }

  const categories = await prisma.category.findMany({ where: { blog_id: blog.id } })
  const posts = await prisma.post.findMany({ where: { blog_id: blog.id }, include: { category: true } })

  async function createPost(formData: FormData) {
    "use server"
    const title = String(formData.get("title") || "").trim()
    const category_id = String(formData.get("category_id") || "").trim() || null
    const description = String(formData.get("description") || "").trim() || null
    const image_url = String(formData.get("image_url") || "").trim() || null
    if (!title) throw new Error("Informe o título")
    const slug = toSlug(title)
    await prisma.post.create({ data: { blog_id: blog!.id, title, slug, category_id, description, image_url } })
    revalidatePath("/dashboard/blog/posts")
  }

  async function deletePost(id: string) {
    "use server"
    await prisma.post.delete({ where: { id } })
    revalidatePath("/dashboard/blog/posts")
  }

  async function updatePost(id: string, formData: FormData) {
    "use server"
    const title = String(formData.get("title") || "").trim()
    const category_id = String(formData.get("category_id") || "").trim() || null
    const description = String(formData.get("description") || "").trim() || null
    const image_url = String(formData.get("image_url") || "").trim() || null
    if (!title) throw new Error("Informe o título")
    const slug = toSlug(title)
    await prisma.post.update({ where: { id }, data: { title, slug, category_id, description, image_url } })
    revalidatePath("/dashboard/blog/posts")
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Posts" subtitle="Escreva e gerencie posts do seu blog." />
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>Escreva e gerencie posts do seu blog.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateCard title="Cadastrar Post" description="Escreva e gerencie posts" iconName="bookOpen" action={createPost}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">Título</label>
                <input id="title" name="title" required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="category_id" className="text-sm font-medium">Categoria</label>
                <select id="category_id" name="category_id" className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="image_url" className="text-sm font-medium">Imagem</label>
                <input id="image_url" name="image_url" placeholder="URL (opcional)" className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                <input id="description" name="description" placeholder="Opcional" className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </CreateCard>
            {posts.map((p) => (
              <Card key={p.id} className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
                <CardHeader className="flex-row items-center gap-3">
                  <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight">{p.title}</CardTitle>
                    {p.category && <CardDescription>{p.category.name}</CardDescription>}
                  </div>
                </CardHeader>
                <CardFooter className="justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="softWarning" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Post</DialogTitle>
                        <DialogDescription>Atualize os dados do post.</DialogDescription>
                      </DialogHeader>
                      <form action={updatePost.bind(null, p.id)} className="space-y-4">
                        <Field>
                          <FieldLabel htmlFor="title">Título</FieldLabel>
                          <FieldContent>
                            <Input id="title" name="title" defaultValue={p.title} required />
                          </FieldContent>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="category_id">Categoria</FieldLabel>
                          <FieldContent>
                            <select id="category_id" name="category_id" className="w-full rounded-md border bg-background px-3 py-2 text-sm" defaultValue={p.category?.id ?? ""}>
                              <option value="">Sem categoria</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </FieldContent>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="image_url">Imagem</FieldLabel>
                          <FieldContent>
                            <Input id="image_url" name="image_url" defaultValue={p.image_url ?? ""} />
                          </FieldContent>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="description">Descrição</FieldLabel>
                          <FieldContent>
                            <Input id="description" name="description" defaultValue={p.description ?? ""} />
                          </FieldContent>
                        </Field>
                        <DialogFooter>
                          <Button type="submit">Salvar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <form action={deletePost.bind(null, p.id)}>
                    <Button type="submit" variant="softDestructive" size="sm"><Trash2 className="mr-1" />Excluir</Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
            {posts.length === 0 && (
              <FieldError>Nenhum post encontrado</FieldError>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
import CreateCard from "@/components/dashboard/create_card"
import { BookOpen } from "lucide-react"
import { createPost } from "@/app/dashboard/blog/posts/actions"
