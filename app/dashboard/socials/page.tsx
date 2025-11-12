import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import SocialsDataTable from "./data_table"
import type { SocialRow } from "./columns"

export default async function SocialsPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <div className="rounded-md border p-4">
          <h2 className="text-lg font-semibold">Social Links</h2>
          <p className="text-sm text-muted-foreground">Faça login para gerenciar redes.</p>
        </div>
      </main>
    )
  }

  const portfolios = await prisma.portfolio.findMany({ where: { user_id: userId } })
  const socials = await prisma.socialLink.findMany({ where: { portfolio_id: { in: portfolios.map(p => p.id) } }, include: { portfolio: true } })

  const portfoliosOptions = portfolios.map((p) => ({ id: p.id, title: p.title }))
  const rows: SocialRow[] = socials.map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    portfolio_title: s.portfolio.title,
  }))

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Social Links" subtitle="Gerencie suas redes por portfólio." />
      <SocialsDataTable data={rows} portfolios={portfoliosOptions} />
    </main>
  )
}
