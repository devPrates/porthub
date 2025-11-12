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
import { FileText, Trash2 } from "lucide-react"

export default async function PagesPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Páginas</CardTitle>
            <CardDescription>Faça login para gerenciar páginas.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const portfolios = await prisma.portfolio.findMany({ where: { user_id: userId } })
  const pages = await prisma.page.findMany({ where: { portfolio_id: { in: portfolios.map(p => p.id) } }, include: { portfolio: true } })

  async function createPage(formData: FormData) {
    "use server"
    const portfolio_id = String(formData.get("portfolio_id") || "").trim()
    const title = String(formData.get("title") || "").trim()
    const slug = toSlug(String(formData.get("slug") || title))
    if (!portfolio_id) throw new Error("Selecione um portfólio")
    if (!title) throw new Error("Informe o título")
    await prisma.page.create({ data: { portfolio_id, title, slug } })
    revalidatePath("/dashboard/portfolio/pages")
  }

  async function deletePage(id: string) {
    "use server"
    await prisma.page.delete({ where: { id } })
    revalidatePath("/dashboard/portfolio/pages")
  }

  async function updatePage(id: string, formData: FormData) {
    "use server"
    const title = String(formData.get("title") || "").trim()
    const slug = toSlug(String(formData.get("slug") || title))
    if (!title) throw new Error("Informe o título")
    await prisma.page.update({ where: { id }, data: { title, slug } })
    revalidatePath("/dashboard/portfolio/pages")
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Páginas" subtitle="Gerencie páginas dinâmicas dos seus portfólios." />
      <Card className="border-indigo-500/30 bg-linear-to-b from-indigo-500/5 via-transparent to-indigo-500/5">
        <CardHeader>
          <CardTitle className="text-lg">Páginas</CardTitle>
          <CardDescription>Gerencie páginas dinâmicas dos seus portfólios.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateCard title="Cadastrar Página" description="Gerencie páginas dinâmicas" iconName="fileText" action={createPage}>
            <div className="space-y-4">
              <div>
                <label htmlFor="portfolio_id" className="text-sm font-medium">Portfólio</label>
                <select id="portfolio_id" name="portfolio_id" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                  <option value="">Selecione</option>
                  {portfolios.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className="text-sm font-medium">Título</label>
                <input id="title" name="title" required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                <input id="slug" name="slug" placeholder="Opcional" className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </CreateCard>
            {pages.map((p) => (
              <Card key={p.id} className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
                <CardHeader className="flex-row items-center gap-3">
                  <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight">{p.title}</CardTitle>
                    <CardDescription>/{p.slug}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Portfólio: {p.portfolio.title}</p>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="softWarning" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Página</DialogTitle>
                        <DialogDescription>Atualize os dados da página.</DialogDescription>
                      </DialogHeader>
                      <form action={updatePage.bind(null, p.id)} className="space-y-4">
                        <Field>
                          <FieldLabel htmlFor="title">Título</FieldLabel>
                          <FieldContent>
                            <Input id="title" name="title" defaultValue={p.title} required />
                          </FieldContent>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="slug">Slug</FieldLabel>
                          <FieldContent>
                            <Input id="slug" name="slug" defaultValue={p.slug} />
                          </FieldContent>
                        </Field>
                        <DialogFooter>
                          <Button type="submit">Salvar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <form action={deletePage.bind(null, p.id)}>
                    <Button type="submit" variant="softDestructive" size="sm"><Trash2 className="mr-1" />Excluir</Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
            {pages.length === 0 && (
              <FieldError>Nenhuma página encontrada</FieldError>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
