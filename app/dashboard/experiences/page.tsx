import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import ExperiencesDataTable from "./data_table"
import type { ExperienceRow } from "./columns"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

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
