import HeroBanner from "@/components/dashboard/hero_banner"
import PortfolioCard from "@/components/dashboard/portfolio_card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { BookmarkPlus, FolderKanban } from "lucide-react"
import Link from "next/link"
import type { Prisma } from "@prisma/client"

export default async function DashboardPortfolioPage() {
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
        title="Portfólio"
        subtitle="Crie e gerencie seus portfólios no dashboard."
      />

      {dbError && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-red-700 dark:border-red-800 dark:bg-red-950">
          {dbError}
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="h-12 w-12 flex items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
              <FolderKanban className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="mt-3 text-base md:text-lg font-semibold">Cadastrar Portfólio</span>
            <span className="mt-1 text-xs text-muted-foreground">Cadastre um novo portfólio</span>
            <div className="mt-4">
              <Link href="/dashboard/portfolio/novo" aria-label="Cadastrar novo portfólio">
                <Button>
                  <BookmarkPlus />
                  Cadastrar
                </Button>
              </Link>
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
              <span className="text-sm text-muted-foreground">Nenhum portfólio encontrado</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
