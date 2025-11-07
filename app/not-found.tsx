import { getSession } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back_button"
import { LockKeyhole, ArrowLeft, LogIn } from "lucide-react"

export default async function NotFound() {
  const session = await getSession()
  const isAuthenticated = Boolean(session)

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <section
        aria-labelledby="notfound-title"
        className="max-w-md w-full text-center space-y-4"
      >
        <div className="flex justify-center">
          <LockKeyhole className="size-10 text-muted-foreground" aria-hidden />
        </div>
        <h1 id="notfound-title" className="text-2xl font-semibold">
          Acesso restrito
        </h1>
        <p className="text-sm text-muted-foreground">
          Você não está autenticado ou a página solicitada não existe. Faça login
          para continuar ou volte à página inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {isAuthenticated ? (
            <BackButton size="sm" className="font-medium" />
          ) : (
            <Button asChild size="sm" className="font-medium">
              <Link href="/" aria-label="Fazer login">
                <LogIn />
                <span>Fazer login</span>
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="font-medium">
            <Link href="/">
              <ArrowLeft />
              <span>Voltar ao início</span>
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}