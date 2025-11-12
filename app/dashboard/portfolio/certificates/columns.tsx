"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { SquarePen, Trash2 } from "lucide-react"
import { updateCertificate, deleteCertificate } from "./actions"

export type CertificateRow = {
  id: string
  name: string
  type: string
  hours?: number | null
  experience_title: string
  date_end?: string | null
}

export const columns: ColumnDef<CertificateRow>[] = [
  {
    id: "seq",
    header: "ID",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.index + 1}</span>,
    enableSorting: false,
    size: 60,
  },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "type", header: "Tipo" },
  { accessorKey: "hours", header: "Horas" },
  { accessorKey: "experience_title", header: "Experiência" },
  { accessorKey: "date_end", header: "Conclusão" },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const c = row.original
      return (
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="softWarning" size="icon" aria-label="Editar certificado">
                <SquarePen className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Certificado</DialogTitle>
                <DialogDescription>Atualize os dados do certificado</DialogDescription>
              </DialogHeader>
              <form action={updateCertificate} className="space-y-4">
                <input type="hidden" name="id" value={c.id} />
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <FieldContent>
                    <Input id="name" name="name" defaultValue={c.name} required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="type">Tipo</FieldLabel>
                  <FieldContent>
                    <select id="type" name="type" className="w-full rounded-md border bg-background px-3 py-2 text-sm" defaultValue={c.type} required>
                      <option value="CURSO">Curso</option>
                      <option value="FORMACAO">Formação</option>
                    </select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="hours">Horas</FieldLabel>
                  <FieldContent>
                    <Input id="hours" name="hours" type="number" min={0} defaultValue={c.hours ?? undefined} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="date_end">Conclusão</FieldLabel>
                  <FieldContent>
                    <Input id="date_end" name="date_end" type="date" defaultValue={c.date_end ?? ""} />
                  </FieldContent>
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <form action={deleteCertificate}>
            <input type="hidden" name="id" value={c.id} />
            <Button type="submit" variant="softDestructive" size="icon" aria-label="Excluir certificado">
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

