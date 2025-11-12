import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { revalidatePath } from "next/cache"
import HeroBanner from "@/components/dashboard/hero_banner"
import ExperiencesDataTable from "./data_table"
import type { ExperienceRow } from "./columns"

export default async function ExperiencesPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Experiências</CardTitle>
            <CardDescription>Faça login para gerenciar experiências.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const portfolios = await prisma.portfolio.findMany({ where: { user_id: userId } })
  const experiences = await prisma.experience.findMany({ where: { portfolio_id: { in: portfolios.map(p => p.id) } }, include: { portfolio: true } })

  async function createExperience(formData: FormData) {
    "use server"
    const portfolio_id = String(formData.get("portfolio_id") || "").trim()
    const title = String(formData.get("title") || "").trim()
    const subtitle = String(formData.get("subtitle") || "").trim() || null
    const description = String(formData.get("description") || "").trim() || null
    if (!portfolio_id) throw new Error("Selecione um portfólio")
    if (!title || title.length < 2) throw new Error("Título inválido")
    await prisma.experience.create({ data: { portfolio_id, title, subtitle, description } })
    revalidatePath("/dashboard/portfolio/experiences")
  }

  async function deleteExperience(id: string) {
    "use server"
    await prisma.experience.delete({ where: { id } })
    revalidatePath("/dashboard/portfolio/experiences")
  }

  async function updateExperience(id: string, formData: FormData) {
    "use server"
    const title = String(formData.get("title") || "").trim()
    const subtitle = String(formData.get("subtitle") || "").trim() || null
    const description = String(formData.get("description") || "").trim() || null
    if (!title || title.length < 2) throw new Error("Título inválido")
    await prisma.experience.update({ where: { id }, data: { title, subtitle, description } })
    revalidatePath("/dashboard/portfolio/experiences")
  }

  const rows: ExperienceRow[] = experiences.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: (e as any).subtitle ?? null,
    portfolio_title: e.portfolio.title,
    created_at: new Date((e as any).created_at ?? Date.now()).toLocaleDateString(),
  }))

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Experiências" subtitle="Crie e gerencie experiências vinculadas aos seus portfólios." />
      <ExperiencesDataTable data={rows} portfolios={portfolios.map((p) => ({ id: p.id, title: p.title }))} />
    </main>
  )
}
