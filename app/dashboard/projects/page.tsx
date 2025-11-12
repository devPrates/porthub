import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import ProjectsDataTable from "./data_table"
import type { ProjectRow } from "./columns"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProjectsPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Projetos</CardTitle>
            <CardDescription>Faça login para gerenciar seus projetos.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const projects = await prisma.project.findMany({ where: { user_id: userId } })

  const rows: ProjectRow[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: (p as any).description ?? null,
    image_url: (p as any).image_url ?? null,
    created_at: new Date((p as any).created_at ?? Date.now()).toLocaleDateString(),
  }))

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Projetos" subtitle="Gerencie seus projetos do portfólio." />
      <ProjectsDataTable data={rows} />
    </main>
  )
}
