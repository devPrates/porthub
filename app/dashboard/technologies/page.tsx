import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toSlug } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import HeroBanner from "@/components/dashboard/hero_banner"
import CreateCard from "@/components/dashboard/create_card"
import { Code2, Trash2 } from "lucide-react"

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany()

  async function createTechnology(formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    if (!name) throw new Error("Informe o nome")
    const slug = toSlug(name)
    await prisma.technology.create({ data: { name, slug } })
    revalidatePath("/dashboard/technologies")
  }

  async function deleteTechnology(slug: string) {
    "use server"
    await prisma.technology.delete({ where: { slug } })
    revalidatePath("/dashboard/technologies")
  }

  async function updateTechnology(slug: string, formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    if (!name) throw new Error("Informe o nome")
    const newSlug = toSlug(name)
    await prisma.technology.update({ where: { slug }, data: { name, slug: newSlug } })
    revalidatePath("/dashboard/technologies")
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Tecnologias" subtitle="Cadastre tecnologias para vincular em seções." />
      <Card className="border-indigo-500/30 bg-linear-to-b from-indigo-500/5 via-transparent to-indigo-500/5">
        <CardHeader>
          <CardTitle className="text-lg">Tecnologias</CardTitle>
          <CardDescription>Cadastre tecnologias para vincular em seções.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateCard title="Cadastrar Tecnologia" description="Cadastre tecnologias" iconName="code2" action={createTechnology}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <input id="name" name="name" required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </CreateCard>
            {technologies.map((t) => (
              <Card key={t.slug} className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
                <CardHeader className="flex-row items-center gap-3">
                  <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
                    <Code2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-base leading-tight">{t.name}</CardTitle>
                    <CardDescription>/{t.slug}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="softWarning" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Tecnologia</DialogTitle>
                        <DialogDescription>Atualize o nome da tecnologia.</DialogDescription>
                      </DialogHeader>
                      <form action={updateTechnology.bind(null, t.slug)} className="space-y-4">
                        <Field>
                          <FieldLabel htmlFor="name">Nome</FieldLabel>
                          <FieldContent>
                            <Input id="name" name="name" defaultValue={t.name} required />
                          </FieldContent>
                        </Field>
                        <DialogFooter>
                          <Button type="submit">Salvar</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <form action={deleteTechnology.bind(null, t.slug)}>
                    <Button type="submit" variant="softDestructive" size="sm"><Trash2 className="mr-1" />Excluir</Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
            {technologies.length === 0 && (
              <FieldError>Nenhuma tecnologia encontrada</FieldError>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
import CreateCard from "@/components/dashboard/create_card"
import { Code2 } from "lucide-react"
import { createTechnology } from "@/app/dashboard/technologies/actions"
