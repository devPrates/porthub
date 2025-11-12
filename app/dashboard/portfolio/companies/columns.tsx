"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { SquarePen, Trash2 } from "lucide-react"
import { updateCompany, deleteCompany } from "./actions"

export type CompanyRow = {
  id: string
  name: string
  role_name: string
  experience_title: string
  date_start?: string | null
}

export const columns: ColumnDef<CompanyRow>[] = [
  {
    id: "seq",
    header: "ID",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    size: 60,
  },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "role_name", header: "Cargo" },
  { accessorKey: "experience_title", header: "Experiência" },
  { accessorKey: "date_start", header: "Início" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const c = row.original
      return (
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="softWarning" size="icon" aria-label="Editar empresa">
                <SquarePen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Empresa</DialogTitle>
                <DialogDescription>Atualize os dados da empresa</DialogDescription>
              </DialogHeader>
              <form action={updateCompany} className="space-y-4">
                <input type="hidden" name="id" value={c.id} />
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <FieldContent>
                    <Input id="name" name="name" defaultValue={c.name} required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="role_name">Cargo</FieldLabel>
                  <FieldContent>
                    <Input id="role_name" name="role_name" defaultValue={c.role_name} required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="date_start">Início</FieldLabel>
                  <FieldContent>
                    <Input id="date_start" name="date_start" type="date" defaultValue={c.date_start ?? ""} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="image_url">Imagem</FieldLabel>
                  <FieldContent>
                    <Input id="image_url" name="image_url" />
                  </FieldContent>
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <form action={deleteCompany}>
            <input type="hidden" name="id" value={c.id} />
            <Button type="submit" variant="softDestructive" size="icon" aria-label="Excluir empresa">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )
    },
    enableSorting: false,
    size: 120,
  },
]
