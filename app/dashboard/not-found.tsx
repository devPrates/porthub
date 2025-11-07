import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileQuestion } from "lucide-react"

export default function DashboardNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <section
        aria-labelledby="dashboard-notfound-title"
        className="max-w-md w-full text-center space-y-4"
      >
        <div className="flex justify-center">
          <FileQuestion className="size-10 text-muted-foreground" aria-hidden />
        </div>
        <h1 id="dashboard-notfound-title" className="text-2xl font-semibold">
          Página do dashboard não encontrada
        </h1>
        <p className="text-sm text-muted-foreground">
          A página que você tentou acessar ainda não existe ou foi movida. Volte
          para a visão geral do dashboard.
        </p>
        <div className="flex justify-center">
          <Button asChild size="sm" className="font-medium">
            <Link href="/dashboard">
              <Home />
              <span>Ir para Visão Geral</span>
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}