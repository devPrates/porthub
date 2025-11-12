import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import CreateCard from "@/components/dashboard/create_card"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import PortfolioStatCard from "@/components/dashboard/portfolio_stat_card"
import { createPortfolio } from "@/app/dashboard/portfolios/actions"

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
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateCard title="Cadastrar Portfólio" description="Gerencie seus portfólios" iconName="folderKanban" action={createPortfolio}>
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <FieldContent>
                <Input id="title" name="title" required minLength={3} maxLength={120} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="subtitle">Subtítulo</FieldLabel>
              <FieldContent>
                <Input id="subtitle" name="subtitle" placeholder="Opcional" maxLength={180} />
              </FieldContent>
            </Field>
            <FieldError />
          </div>
        </CreateCard>
      </section>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {portfolios.length === 0 ? (
          <div className="rounded-md border p-4">
            <p className="text-sm text-muted-foreground">Nenhum portfólio encontrado.</p>
          </div>
        ) : (
          portfolios.map((p) => (
            <PortfolioStatCard
              key={p.id}
              portfolio={{ id: p.id, title: p.title, subtitle: (p as any).subtitle ?? null }}
              counts={{ projects: p._count.projects, experiences: p._count.experiences, socials: p._count.socials, pages: p._count.pages }}
            />
          ))
        )}
      </section>
    </main>
  )
}
