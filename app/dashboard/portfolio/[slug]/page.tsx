import { notFound } from "next/navigation"
import Link from "next/link"
import HeroBanner from "@/components/dashboard/hero_banner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { toSlug } from "@/lib/utils"
import { FolderKanban, Sparkles, Info } from "lucide-react"

interface PageProps {
  params: { slug: string }
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = params

  // Como o modelo Portfolio ainda não possui campo `slug`,
  // fazemos o match pelo título normalizado.
  const portfolios = await prisma.portfolio.findMany({
    include: {
      _count: { select: { projects: true, experiences: true, socials: true, pages: true } },
      hero: { include: { technologies: true } },
      about: { include: { technologies: true } },
    },
  })
  const portfolio = portfolios.find((p) => toSlug(p.title) === slug)

  if (!portfolio) return notFound()

  return (
    <main className="container mx-auto space-y-6" role="main">
      <HeroBanner
        title={portfolio.title}
        subtitle={portfolio.subtitle ?? "Gerencie seu portfólio"}
        rightIcon={<FolderKanban className="h-6 w-6" aria-hidden="true" />}
      />
      {/* GRID DE CARDS */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* HERO CARD */}
        <Card
          aria-labelledby="hero-card-title"
          className="transition-colors hover:bg-muted/10 hover:border-muted-foreground/20"
        >
          <CardHeader className="border-b pb-3">
            <CardTitle id="hero-card-title" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-indigo-500/10 text-indigo-600">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-semibold">Hero</span>
            </CardTitle>
            <CardDescription>Apresente quem você é de forma direta.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {portfolio.hero ? (
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{portfolio.hero.name}</h1>
                {/* Hero não possui subtítulo no modelo atual */}
                {portfolio.hero.description && (
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground rounded-md border bg-muted/20 p-3">
                    {portfolio.hero.description}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Configure nome e uma breve descrição para o cabeçalho do portfólio.
              </p>
            )}
          </CardContent>
          <Separator />
          <CardFooter className="flex gap-2 justify-end pt-3">
            <Button asChild aria-label="Gerenciar Hero">
              <Link href={`/dashboard/portfolio/${slug}/hero`}>Gerenciar Hero</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* ABOUT CARD */}
        <Card
          aria-labelledby="about-card-title"
          className="transition-colors hover:bg-muted/10 hover:border-muted-foreground/20"
        >
          <CardHeader className="border-b pb-3">
            <CardTitle id="about-card-title" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-purple-500/10 text-purple-600">
                <Info className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-semibold">About</span>
            </CardTitle>
            <CardDescription>Conte sua história e valores profissionais.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {portfolio.about ? (
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{portfolio.about.title}</h1>
                {portfolio.about.subtitle && (
                  <h3 className="text-lg md:text-xl font-medium text-muted-foreground">{portfolio.about.subtitle}</h3>
                )}
                {portfolio.about.description && (
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground rounded-md border bg-muted/20 p-3">
                    {portfolio.about.description}
                  </pre>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Defina título, subtítulo e uma descrição clara sobre você.
              </p>
            )}
          </CardContent>
          <Separator />
          <CardFooter className="flex gap-2 justify-end pt-3">
            <Button asChild aria-label="Gerenciar About">
              <Link href={`/dashboard/portfolio/${slug}/about`}>Gerenciar About</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
