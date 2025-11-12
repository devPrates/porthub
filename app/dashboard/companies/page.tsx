import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import CompaniesDataTable from "./data_table"

export default async function CompaniesPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <div className="rounded-md border p-4">
          <h2 className="text-lg font-semibold">Empresas</h2>
          <p className="text-sm text-muted-foreground">Faça login para gerenciar empresas.</p>
        </div>
      </main>
    )
  }

  const portfolios = await prisma.portfolio.findMany({ where: { user_id: userId }, include: { experiences: true } })
  const experiences = await prisma.experience.findMany({ where: { portfolio_id: { in: portfolios.map(p => p.id) } } })
  const companies = await prisma.company.findMany({ where: { experience_id: { in: experiences.map(e => e.id) } }, include: { experience: true } })

  const experiencesOptions = experiences.map((e) => ({ id: e.id, title: e.title }))
  const rows = companies.map((c) => ({
    id: c.id,
    name: c.name,
    role_name: c.role_name,
    experience_title: c.experience.title,
    date_start: c.date_start ? c.date_start.toISOString().slice(0, 10) : null,
  }))

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Empresas" subtitle="Cadastre empresas vinculadas às suas experiências." />
      <CompaniesDataTable data={rows} experiences={experiencesOptions} />
    </main>
  )
}
