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

const heroSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().optional(),
})

export default async function HeroPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const portfolios = await prisma.portfolio.findMany({ include: { hero: true } })
  const portfolio = portfolios.find((p) => toSlug(p.title) === slug)
  if (!portfolio) return notFound()
  const portfolioId = portfolio.id

  async function saveHero(formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    const description = String(formData.get("description") || "").trim()

    const parsed = heroSchema.safeParse({ name, description })
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map((i) => i.message).join(", "))
    }

    await prisma.hero.upsert({
      where: { portfolio_id: portfolioId },
      update: { name: parsed.data.name, description: parsed.data.description ?? null },
      create: { portfolio_id: portfolioId, name: parsed.data.name, description: parsed.data.description ?? null },
    })

    revalidatePath(`/dashboard/portfolio/${slug}/hero`)
    redirect(`/dashboard/portfolio/${slug}/hero`)
  }

  async function deleteHero() {
    "use server"
    await prisma.hero.delete({ where: { portfolio_id: portfolioId } })
    revalidatePath(`/dashboard/portfolio/${slug}/hero`)
    redirect(`/dashboard/portfolio/${slug}/hero`)
  }

  return (
    <main className="container mx-auto space-y-6" role="main">
      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Defina seu nome e uma breve descrição.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={saveHero} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={portfolio.hero?.name ?? ""} placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={portfolio.hero?.description ?? ""}
                placeholder="Uma breve descrição"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={4}
              />
            </div>
            <Button type="submit" aria-label="Salvar Hero">Salvar</Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <Button asChild variant="secondary" aria-label="Voltar">
            <Link href={`/dashboard/portfolio/${slug}`}>Voltar</Link>
          </Button>
          {portfolio.hero && (
            <form action={deleteHero}>
              <Button type="submit" variant="destructive" aria-label="Excluir Hero">Excluir</Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
