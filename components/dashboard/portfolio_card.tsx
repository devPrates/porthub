import Link from "next/link"
import { revalidatePath } from "next/cache"
import { Portfolio } from "@prisma/client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { cn, toSlug } from "@/lib/utils"
import { FolderKanban, Pencil, Trash2, Layers, Briefcase, Share2, FileText } from "lucide-react"

interface PortfolioCardProps {
  portfolio: Portfolio & {
    _count: { projects: number; experiences: number; socials: number; pages: number }
  }
  className?: string
}

export default function PortfolioCard({ portfolio, className }: PortfolioCardProps) {
  const { title, subtitle, _count } = portfolio
  const slug = toSlug(title)

  return (
    <Card
      className={cn(
        "group overflow-hidden border-indigo-500/20 hover:border-indigo-500/40 transition-colors",
        "bg-linear-to-b from-indigo-500/5 via-transparent to-indigo-500/5",
        className
      )}
      aria-label={`Portifolio ${title}`}
    >
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600">
            <FolderKanban className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-lg leading-tight">{title}</CardTitle>
            {subtitle && <CardDescription className="mt-0.5">{subtitle}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="list" aria-label="Resumo do portifolio">
          <div className="flex items-center justify-between rounded-md border border-indigo-500/20 bg-indigo-500/5 p-2" role="listitem" aria-label="Projetos">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium tabular-nums">{_count.projects}</span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-indigo-500/20 bg-indigo-500/5 p-2" role="listitem" aria-label="Experiências">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium tabular-nums">{_count.experiences}</span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-indigo-500/20 bg-indigo-500/5 p-2" role="listitem" aria-label="Redes">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium tabular-nums">{_count.socials}</span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-indigo-500/20 bg-indigo-500/5 p-2" role="listitem" aria-label="Páginas">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium tabular-nums">{_count.pages}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button asChild variant="outline" size="sm" aria-label="Editar portifolio">
          <Link href={`/dashboard/portifolio/${slug}`}>
            <Pencil className="mr-1" /> Editar
          </Link>
        </Button>
        <form action={deletePortfolio.bind(null, portfolio.id)}>
          <Button type="submit" variant="destructive" size="sm" aria-label="Excluir portifolio">
            <Trash2 className="mr-1" /> Excluir
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

export async function deletePortfolio(id: string) {
  "use server"
  await prisma.portfolio.delete({ where: { id } })
  revalidatePath("/dashboard/portifolio")
}