import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { toSlug } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tags, Trash2 } from "lucide-react"
import { revalidatePath } from "next/cache"
import HeroBanner from "@/components/dashboard/hero_banner"
import CreateCard from "@/components/dashboard/create_card"

export default async function BlogCategoriesPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Faça login para gerenciar categorias.</CardDescription>
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

  async function createCategory(formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    if (!name) throw new Error("Informe o nome")
    const slug = toSlug(name)
    await prisma.category.create({ data: { blog_id: blog!.id, name, slug } })
    revalidatePath("/dashboard/blog/categories")
  }

  async function deleteCategory(id: string) {
    "use server"
    await prisma.category.delete({ where: { id } })
    revalidatePath("/dashboard/blog/categories")
  }

  async function updateCategory(id: string, formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    if (!name) throw new Error("Informe o nome")
    const slug = toSlug(name)
    await prisma.category.update({ where: { id }, data: { name, slug } })
    revalidatePath("/dashboard/blog/categories")
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Categorias" subtitle="Organize seu blog com categorias." />
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Organize seu blog com categorias.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CreateCard title="Cadastrar Categoria" description="Organize seu blog com categorias" iconName="tags" action={createCategory}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <input id="name" name="name" required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </CreateCard>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((c) => (
              <Card key={c.id} className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
                <CardHeader className="flex-row items-center gap-3">
                  <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
                    <Tags className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight">{c.name}</CardTitle>
                    <CardDescription>/{c.slug}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="softWarning" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                        <DialogDescription>Atualize os dados da categoria.</DialogDescription>
                      </DialogHeader>
                      <form action={updateCategory.bind(null, c.id)} className="space-y-4">
                        <Field>
                          <FieldLabel htmlFor="name">Nome</FieldLabel>
                          <FieldContent>
                            <Input id="name" name="name" defaultValue={c.name} required />
                          </FieldContent>
                        </Field>
                        <DialogFooter>
                          <Button type="submit">Salvar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <form action={deleteCategory.bind(null, c.id)}>
                    <Button type="submit" variant="softDestructive" size="sm"><Trash2 className="mr-1" />Excluir</Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
            {categories.length === 0 && (
              <FieldError>Nenhuma categoria encontrada</FieldError>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
import CreateCard from "@/components/dashboard/create_card"
import { Tags } from "lucide-react"
import { createCategory } from "@/app/dashboard/blog/categories/actions"
