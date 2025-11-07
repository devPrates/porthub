import Link from "next/link"
import HeroBanner from "@/components/dashboard/hero_banner"
import PortfolioCard from "@/components/dashboard/portfolio_card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"

export default async function DashboardPortifolioPage() {
  const portfolios = await prisma.portfolio.findMany({
    include: { _count: { select: { projects: true, experiences: true, socials: true, pages: true } } },
  })

  return (
    <div className="container mx-auto space-y-6">
      <HeroBanner
        title="Portifolio"
        subtitle="Crie e gerencie seus portifolios no dashboard."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de criação: somente o botão interno é clicável */}
        <Card
          className="border-0 dashed-large-border text-emerald-700 max-w-[16rem] md:max-w-[18rem] bg-emerald-50/40 dark:bg-emerald-900/10 transition-colors hover:bg-emerald-100/60 dark:hover:bg-emerald-900/20"
        >
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="h-12 w-12 flex items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/10 text-emerald-700">
              <Plus className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="mt-3 text-base md:text-lg font-semibold">Criar Portifolio</span>
            <span className="mt-1 text-xs text-muted-foreground">Comece um novo portifolio</span>
            <Button asChild className="mt-4" aria-label="Criar novo portifolio">
              <Link href="/dashboard/portifolio/new">Criar</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Lista de portfólios existentes do banco */}
        {portfolios.map((p) => (
          <PortfolioCard key={p.id} portfolio={p} />
        ))}
      </div>
    </div>
  )
}