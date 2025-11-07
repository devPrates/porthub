import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function AdminUsersPage() {
  const session = await getSession()
  const role = (session?.user as any)?.role

  if (role !== "ADMIN") {
    // Apenas administradores podem acessar esta página
    return notFound()
  }

  return (
    <main className="flex flex-col gap-4 p-4" aria-labelledby="admin-users-title">
      <header>
        <h1 id="admin-users-title" className="text-2xl font-semibold">
          Usuários (Admin)
        </h1>
        <p className="text-sm text-muted-foreground">
          Página dedicada ao gerenciamento de usuários. Em breve: listagem, criação,
          edição e exclusão.
        </p>
      </header>

      <section aria-labelledby="admin-users-overview-title" className="space-y-2">
        <h2 id="admin-users-overview-title" className="text-lg font-medium">
          Visão Geral
        </h2>
        <p className="text-sm text-muted-foreground">
          Esta seção permitirá operações CRUD sobre usuários do sistema.
        </p>
      </section>

      <section aria-labelledby="admin-users-placeholders-title" className="space-y-2">
        <h2 id="admin-users-placeholders-title" className="text-lg font-medium">
          Elementos (placeholder)
        </h2>
        <div className="text-sm text-muted-foreground">
          • Listagem de usuários
          <br />• Criar novo usuário
          <br />• Editar usuário existente
          <br />• Excluir usuário
        </div>
      </section>
    </main>
  )
}