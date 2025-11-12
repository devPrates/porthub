import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderKanban, SquarePen, Trash2 } from "lucide-react"
import { toSlug } from "@/lib/utils"
import BarVerticalLabelChart from "@/components/dashboard/bar_vertical_label_chart"
import { deletePortfolio as serverDeletePortfolio } from "@/components/dashboard/portfolio_card"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type Counts = { projects: number; experiences: number; socials: number; pages: number }

export default function PortfolioStatCard({
  portfolio,
  counts,
}: {
  portfolio: { id: string; title: string; subtitle?: string | null }
  counts: Counts
}) {
  const slug = toSlug(portfolio.title)
  const items = [
    { key: "projects", label: "Projetos", value: counts.projects },
    { key: "experiences", label: "Experiências", value: counts.experiences },
    { key: "socials", label: "Redes", value: counts.socials },
    { key: "pages", label: "Páginas", value: counts.pages },
  ]

  return (
    <Card className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
      <CardHeader className="flex-row items-center gap-3">
        <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
          <FolderKanban className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <CardTitle className="text-base leading-tight">{portfolio.title}</CardTitle>
          {portfolio.subtitle && <CardDescription>{portfolio.subtitle}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="h-[200px]">
        <BarVerticalLabelChart items={items} className="h-full w-full" />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button asChild size="sm" aria-label="Editar portfólio" variant="softWarning">
          <Link href={`/dashboard/portfolio/${slug}`}>
            <SquarePen className="mr-1" /> Editar
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="softDestructive" size="sm" aria-label="Excluir portfólio">
              <Trash2 className="mr-1" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir portfólio?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é permanente e removerá o portfólio e seus vínculos. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <form action={serverDeletePortfolio.bind(null, portfolio.id)}>
                <AlertDialogAction asChild>
                  <Button type="submit" variant="destructive" size="sm" aria-label="Confirmar exclusão">
                    Confirmar
                  </Button>
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
