"use client"
import { useMemo, useState } from "react"
import { DataTable } from "@/components/dashboard/data_table"
import { columns, type ProjectRow } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, BookmarkPlus } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { createProject } from "./actions"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input as TextInput } from "@/components/ui/input"

export default function ProjectsDataTable({ data }: { data: ProjectRow[] }) {
  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((p) => p.title.toLowerCase().includes(q))
  }, [data, query])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const aTime = new Date(a.created_at).getTime()
      const bTime = new Date(b.created_at).getTime()
      return sortAsc ? aTime - bTime : bTime - aTime
    })
    return arr
  }, [filtered, sortAsc])

  const [openNew, setOpenNew] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Pesquisar por título..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[280px]"
            aria-label="Pesquisar projetos"
          />
          <Button
            variant="outline"
            aria-label={sortAsc ? "Ordenar por criação ascendente" : "Ordenar por criação descendente"}
            title={sortAsc ? "Ordenar por criação ascendente" : "Ordenar por criação descendente"}
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button aria-label="Cadastrar projeto">
                <BookmarkPlus className="h-4 w-4" />
                Cadastrar
              </Button>
            </DialogTrigger>
            <DialogContent aria-label="Dialog de criação de projeto">
              <form action={createProject} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="title">Título</FieldLabel>
                  <FieldContent>
                    <TextInput id="title" name="title" required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="image_url">Imagem</FieldLabel>
                  <FieldContent>
                    <TextInput id="image_url" name="image_url" placeholder="URL (opcional)" />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <FieldContent>
                    <TextInput id="description" name="description" placeholder="Opcional" />
                  </FieldContent>
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">Cadastrar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable columns={columns} data={sorted} />
    </div>
  )
}
