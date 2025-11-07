import HeroBanner from "@/components/dashboard/hero_banner"
import PortfolioCard from "@/components/dashboard/portfolio_card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Plus } from "lucide-react"
import PortfolioCreateDialog from "@/components/dashboard/portfolio_create_dialog"
import type { Prisma } from "@prisma/client"

export default async function DashboardPortifolioPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  let dbError: string | null = null
  type PortfolioWithCounts = Prisma.PortfolioGetPayload<{
    include: { _count: { select: { projects: true; experiences: true; socials: true; pages: true } } }
  }>
  let portfolios: PortfolioWithCounts[] = []
  try {
    portfolios = await prisma.portfolio.findMany({
      where: userId ? { user_id: userId } : undefined,
      include: { _count: { select: { projects: true, experiences: true, socials: true, pages: true } } },
    })
  } catch (e) {
    dbError = "Banco de dados indisponível. Verifique sua conexão ou variável DATABASE_URL."
  }

  return (
    <div className="container mx-auto space-y-6">
      <HeroBanner
        title="Portifolio"
        subtitle="Crie e gerencie seus portifolios no dashboard."
      />

      {dbError && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-800 dark:bg-red-950">
          {dbError}
        </div>
      )}

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
            <div className="mt-4">
              <PortfolioCreateDialog />
            </div>
          </CardContent>
        </Card>

        {/* Lista de portfólios existentes do banco */}
        {portfolios.map((p) => (
          <PortfolioCard key={p.id} portfolio={p} />
        ))}
        {portfolios.length === 0 && !dbError && (
          <Card className="max-w-[16rem] md:max-w-[18rem] bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Nenhum portifolio encontrado</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}