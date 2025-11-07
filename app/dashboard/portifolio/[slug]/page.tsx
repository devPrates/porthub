import { notFound } from "next/navigation"
import HeroBanner from "@/components/dashboard/hero_banner"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
import { FolderKanban } from "lucide-react"

interface PageProps {
  params: { slug: string }
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = params

  // Como o modelo Portfolio ainda não possui campo `slug`,
  // fazemos o match pelo título normalizado.
  const portfolios = await prisma.portfolio.findMany({
    include: { _count: { select: { projects: true, experiences: true, socials: true, pages: true } } },
  })
  const portfolio = portfolios.find((p) => toSlug(p.title) === slug)

  if (!portfolio) return notFound()

  return (
    <div className="container mx-auto space-y-6">
      <HeroBanner
        title={portfolio.title}
        subtitle={portfolio.subtitle ?? "Gerencie seu portifolio"}
        rightIcon={<FolderKanban className="h-6 w-6" aria-hidden="true" />}
      />

      <Card>
        <CardContent className="py-8">
          <div className="text-sm text-muted-foreground">
            <p>Projetos: {portfolio._count.projects}</p>
            <p>Experiências: {portfolio._count.experiences}</p>
            <p>Redes: {portfolio._count.socials}</p>
            <p>Páginas: {portfolio._count.pages}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}