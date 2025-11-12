"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { SquarePen, Trash2 } from "lucide-react"
import { updateProject, deleteProject } from "./actions"

export type ProjectRow = {
  id: string
  title: string
  description?: string | null
  image_url?: string | null
  created_at: string
}

export const columns: ColumnDef<ProjectRow>[] = [
  {
    id: "seq",
    header: "ID",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    size: 60,
  },
  { accessorKey: "title", header: "Título" },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{String(getValue() || "")}</span>,
  },
  {
    accessorKey: "image_url",
    header: "Imagem",
    cell: ({ getValue }) => {
      const v = String(getValue() || "")
      return v ? <a href={v} target="_blank" rel="noreferrer" className="text-xs underline">{v}</a> : <span className="text-xs text-muted-foreground">—</span>
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{String(getValue() || "")}</span>,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const p = row.original
      return (
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="softWarning" size="icon" aria-label="Editar projeto">
                <SquarePen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Projeto</DialogTitle>
                <DialogDescription>Atualize os dados do projeto</DialogDescription>
              </DialogHeader>
              <form action={updateProject} className="space-y-4">
                <input type="hidden" name="id" value={p.id} />
                <Field>
                  <FieldLabel htmlFor="title">Título</FieldLabel>
                  <FieldContent>
                    <Input id="title" name="title" defaultValue={p.title} required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="image_url">Imagem</FieldLabel>
                  <FieldContent>
                    <Input id="image_url" name="image_url" defaultValue={p.image_url ?? ""} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <FieldContent>
                    <Input id="description" name="description" defaultValue={p.description ?? ""} />
                  </FieldContent>
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <form action={deleteProject}>
            <input type="hidden" name="id" value={p.id} />
            <Button type="submit" variant="softDestructive" size="icon" aria-label="Excluir projeto">
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
