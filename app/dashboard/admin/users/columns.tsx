"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type UserRow = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  avatar_url?: string | null
  created_at: string
}

export const columns: ColumnDef<UserRow>[] = [
  {
    id: "seq",
    header: "ID",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Perfil",
    cell: ({ row }) => {
      const role = row.original.role
      const styles =
        role === "ADMIN"
          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-100"
          : "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-100"
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}>
          {role}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      const created = new Date(row.original.created_at)
      return (
        <span className="text-sm">
          {created.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          aria-label="Editar usuário"
          className="border-0 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800 focus-visible:ring-amber-500/30"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Excluir usuário"
          className="border-0 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-100 dark:hover:bg-rose-800 focus-visible:ring-rose-500/30"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    size: 100,
  },
]