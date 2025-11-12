"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { SquarePen, Trash2 } from "lucide-react"
import { updateSocial, deleteSocial } from "./actions"

export type SocialRow = {
  id: string
  name: string
  url: string
  portfolio_title: string
}

export const columns: ColumnDef<SocialRow>[] = [
  {
    id: "seq",
    header: "ID",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    size: 60,
  },
  { accessorKey: "name", header: "Nome" },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ getValue }) => {
      const v = String(getValue() || "")
      return v ? <a href={v} target="_blank" rel="noreferrer" className="text-xs underline">{v}</a> : <span className="text-xs text-muted-foreground">—</span>
    },
  },
  { accessorKey: "portfolio_title", header: "Portfólio" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const s = row.original
      return (
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="softWarning" size="icon" aria-label="Editar social link">
                <SquarePen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Social Link</DialogTitle>
                <DialogDescription>Atualize os dados da rede</DialogDescription>
              </DialogHeader>
              <form action={updateSocial} className="space-y-4">
                <input type="hidden" name="id" value={s.id} />
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <FieldContent>
                    <Input id="name" name="name" defaultValue={s.name} required />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="url">URL</FieldLabel>
                  <FieldContent>
                    <Input id="url" name="url" type="url" defaultValue={s.url} required />
                  </FieldContent>
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <form action={deleteSocial}>
            <input type="hidden" name="id" value={s.id} />
            <Button type="submit" variant="softDestructive" size="icon" aria-label="Excluir social link">
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

