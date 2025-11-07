"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
import EditUserForm from "./edit_user_form"
import { delete_user_action, type ActionState } from "./actions"
import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export type UserRow = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  avatar_url?: string | null
  created_at: string
}

function RowActions({ user }: { user: UserRow }) {
  const router = useRouter()
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [state, formAction] = useActionState<ActionState, FormData>(delete_user_action, { ok: false, message: "" })

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      setOpenDelete(false)
      router.refresh()
    } else {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <div className="flex items-center gap-1">
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Editar usuário"
            className="border-0 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-800 focus-visible:ring-amber-500/30"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent aria-label="Dialog de edição de usuário">
          <EditUserForm
            user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
            onSuccess={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Excluir usuário"
            className="border-0 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-100 dark:hover:bg-rose-800 focus-visible:ring-rose-500/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent aria-label="Confirmar exclusão de usuário">
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="id" value={user.id} />
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir "{user.name}"? Esta ação é permanente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
              <Button type="submit" aria-label="Confirmar exclusão">Excluir</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
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
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Perfil",
    cell: ({ row }) => {
      const role = row.original.role
      const styles =
        role === "ADMIN"
          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-100"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-100"
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
        <span className="text-xs text-muted-foreground">
          {created.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <RowActions user={row.original} />,
    enableSorting: false,
    size: 100,
  },
]