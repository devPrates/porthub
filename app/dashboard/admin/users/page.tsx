import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import HeroBanner from "@/components/dashboard/hero_banner"
import { User as UserIcon } from "lucide-react"
import UsersDataTable from "./data_table"

export default async function AdminUsersPage() {
  const session = await getSession()
  const role = (session?.user as any)?.role

  if (role !== "ADMIN") {
    // Apenas administradores podem acessar esta página
    return notFound()
  }

  // Buscar usuários reais do banco (sem dados mockados)
  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar_url: true,
      created_at: true,
    },
  })

  const tableData = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar_url: u.avatar_url ?? null,
    created_at: u.created_at.toISOString(),
  }))

  return (
    <main className="flex flex-col gap-4 p-4" aria-labelledby="admin-users-title">
      <HeroBanner
        title="Usuários (Admin)"
        subtitle="Página dedicada ao gerenciamento de usuários. Abaixo, a listagem atual de usuários."
        rightIcon={<UserIcon className="h-6 w-6" />}
      />

      <section aria-labelledby="admin-users-list-title" className="space-y-2">
        <h2 id="admin-users-list-title" className="text-lg font-medium">
          Lista de Usuários
        </h2>
        <UsersDataTable data={tableData} />
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