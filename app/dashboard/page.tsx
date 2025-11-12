// Proteção de rota movida para middleware; página não valida sessão diretamente
// Conteúdo do dashboard; layout com sidebar já é fornecido por app/dashboard/layout.tsx

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import HeroBanner from "@/components/dashboard/hero_banner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import StatsBarChart from "@/components/dashboard/stats_bar_chart"

export async function DashboardPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    // Proteção adicional: caso middleware não intercepte
    return redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar_url: true,
      bio: true,
      created_at: true,
      updated_at: true,
      api_keys: { select: { id: true, is_active: true } },
      portfolios: {
        select: {
          id: true,
          title: true,
          projects: { select: { id: true } },
          experiences: { select: { id: true } },
          socials: { select: { id: true } },
          pages: { select: { id: true } },
        },
      },
      blogs: {
        select: {
          id: true,
          title: true,
          posts: { select: { id: true } },
          categories: { select: { id: true } },
        },
      },
    },
  })

  if (!user) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Erro ao carregar dados</h2>
          <p className="text-sm text-muted-foreground">
            Não foi possível obter informações do usuário.
          </p>
        </div>
      </div>
    )
  }

  const apiKeysTotal = user.api_keys.length
  const apiKeysAtivas = user.api_keys.filter((k) => k.is_active).length

  const portfolios = user.portfolios ?? []
  const portfolioCount = portfolios.length
  const portfolioProjects = portfolios.reduce((sum, p) => sum + p.projects.length, 0)
  const portfolioExperiences = portfolios.reduce((sum, p) => sum + p.experiences.length, 0)
  const portfolioSocials = portfolios.reduce((sum, p) => sum + p.socials.length, 0)
  const portfolioPages = portfolios.reduce((sum, p) => sum + p.pages.length, 0)

  const blogs = user.blogs ?? []
  const blogPosts = blogs.reduce((sum, b) => sum + b.posts.length, 0)
  const blogCategories = blogs.reduce((sum, b) => sum + b.categories.length, 0)

  const portfolioChartItems = [
    { key: "portfolios", label: "Portfólios", value: portfolioCount },
    { key: "experiences", label: "Experiências", value: portfolioExperiences },
    { key: "projects", label: "Projetos", value: portfolioProjects },
    { key: "pages", label: "Páginas", value: portfolioPages },
    { key: "socials", label: "Social Links", value: portfolioSocials },
  ]

  const blogChartItems = [
    { key: "posts", label: "Posts", value: blogPosts },
    { key: "categories", label: "Categorias", value: blogCategories },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Hero */}
      <HeroBanner
        title={`Olá, ${user.name ?? "Usuário"}`}
        subtitle="Bem-vindo à sua dashboard. Veja abaixo o resumo visual do seu conteúdo."
      />

      {/* Grid responsivo: empilha no mobile, duas colunas em telas grandes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Resumo do portfólio</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] md:h-[320px] flex items-center">
            <StatsBarChart items={portfolioChartItems} className="aspect-auto w-fit" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Resumo do blog</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px] md:h-[320px] flex items-center">
            <StatsBarChart items={blogChartItems} className="aspect-auto w-fit" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default function Page() {
  return <DashboardPage />
}
