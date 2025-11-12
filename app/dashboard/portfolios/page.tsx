import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import PortfolioCreateDialog from "@/components/dashboard/portfolio_create_dialog"
import PortfolioCard from "@/components/dashboard/portfolio_card"

export default async function Page() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <div className="rounded-md border p-4">
          <h2 className="text-lg font-semibold">Portfólios</h2>
          <p className="text-sm text-muted-foreground">Faça login para gerenciar portfólios.</p>
        </div>
      </main>
    )
  }

  const portfolios = await prisma.portfolio.findMany({
    where: { user_id: userId },
    include: { _count: { select: { projects: true, experiences: true, socials: true, pages: true } } },
  })

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Portfólios" subtitle="Crie e gerencie seus portfólios." />
      <div className="flex items-center justify-end">
        <PortfolioCreateDialog />
      </div>
      {portfolios.length === 0 ? (
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">Nenhum portfólio encontrado.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((p) => (
            <PortfolioCard key={p.id} portfolio={p as any} />
          ))}
        </section>
      )}
    </main>
  )
}