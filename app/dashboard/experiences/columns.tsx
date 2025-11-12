"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { SquarePen, Trash2 } from "lucide-react"
import { updateExperience, deleteExperience } from "./actions"

export type ExperienceRow = {
  id: string
  title: string
  subtitle?: string | null
  portfolio_title: string
  created_at: string
}

export const columns: ColumnDef<ExperienceRow>[] = [
  {
    id: "seq",
    header: "ID",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    size: 60,
  },
  { accessorKey: "title", header: "Título" },
  { accessorKey: "subtitle", header: "Subtítulo" },
  { accessorKey: "portfolio_title", header: "Portfólio" },
  { accessorKey: "created_at", header: "Criado em" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const e = row.original
      return (
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="softWarning" size="icon" aria-label="Editar experiência">
                <SquarePen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Experiência</DialogTitle>
                <DialogDescription>Atualize os dados da experiência</DialogDescription>
              </DialogHeader>
              <form action={updateExperience} className="space-y-4">
                <input type="hidden" name="id" value={e.id} />
                <Field>
                  <FieldLabel htmlFor="title">Título</FieldLabel>
                  <FieldContent>
                    <Input id="title" name="title" defaultValue={e.title} required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="subtitle">Subtítulo</FieldLabel>
                  <FieldContent>
                    <Input id="subtitle" name="subtitle" defaultValue={e.subtitle ?? ""} />
                  </FieldContent>
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <form action={deleteExperience}>
            <input type="hidden" name="id" value={e.id} />
            <Button type="submit" variant="softDestructive" size="icon" aria-label="Excluir experiência">
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
