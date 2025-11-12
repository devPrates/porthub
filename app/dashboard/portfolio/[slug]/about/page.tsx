import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const aboutSchema = z.object({
  title: z.string().min(2, "Título muito curto"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
})

export default async function AboutPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const portfolios = await prisma.portfolio.findMany({ include: { about: true } })
  const portfolio = portfolios.find((p) => toSlug(p.title) === slug)
  if (!portfolio) return notFound()
  const portfolioId = portfolio.id

  async function saveAbout(formData: FormData) {
    "use server"
    const title = String(formData.get("title") || "").trim()
    const subtitle = String(formData.get("subtitle") || "").trim()
    const description = String(formData.get("description") || "").trim()

    const parsed = aboutSchema.safeParse({ title, subtitle, description })
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((i) => i.message).join(", "))
    }

    await prisma.about.upsert({
      where: { portfolio_id: portfolioId },
      update: {
        title: parsed.data.title,
        subtitle: parsed.data.subtitle ?? null,
        description: parsed.data.description ?? null,
      },
      create: {
        portfolio_id: portfolioId,
        title: parsed.data.title,
        subtitle: parsed.data.subtitle ?? null,
        description: parsed.data.description ?? null,
      },
    })

    revalidatePath(`/dashboard/portfolio/${slug}/about`)
    redirect(`/dashboard/portfolio/${slug}/about`)
  }

  async function deleteAbout() {
    "use server"
    await prisma.about.delete({ where: { portfolio_id: portfolioId } })
    revalidatePath(`/dashboard/portfolio/${slug}/about`)
    redirect(`/dashboard/portfolio/${slug}/about`)
  }

  return (
    <main className="container mx-auto space-y-6" role="main">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Defina título, subtítulo e descrição sobre você.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={saveAbout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" defaultValue={portfolio.about?.title ?? ""} placeholder="Sobre mim" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input id="subtitle" name="subtitle" defaultValue={portfolio.about?.subtitle ?? ""} placeholder="Tecnologias e experiência" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={portfolio.about?.description ?? ""}
                placeholder="Uma descrição clara sobre você"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={5}
              />
            </div>
            <Button type="submit" aria-label="Salvar About">Salvar</Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <Button asChild variant="secondary" aria-label="Voltar">
            <Link href={`/dashboard/portfolio/${slug}`}>Voltar</Link>
          </Button>
          {portfolio.about && (
            <form action={deleteAbout}>
              <Button type="submit" variant="destructive" aria-label="Excluir About">Excluir</Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
