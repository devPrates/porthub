"use client"
import { useMemo, useState } from "react"
import { DataTable } from "@/components/dashboard/data_table"
import { columns, type CompanyRow } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, BookmarkPlus } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { createCompany } from "./actions"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Input as TextInput } from "@/components/ui/input"

export default function CompaniesDataTable({ data, experiences }: { data: CompanyRow[]; experiences: { id: string; title: string }[] }) {
  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((c) => [c.name, c.role_name, c.experience_title].some((v) => v.toLowerCase().includes(q)))
  }, [data, query])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const aTime = new Date(a.date_start || Date.now()).getTime()
      const bTime = new Date(b.date_start || Date.now()).getTime()
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
            placeholder="Pesquisar por nome, cargo ou experiência..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[300px]"
            aria-label="Pesquisar empresas"
          />
          <Button
            variant="outline"
            aria-label={sortAsc ? "Ordenar por início ascendente" : "Ordenar por início descendente"}
            title={sortAsc ? "Ordenar por início ascendente" : "Ordenar por início descendente"}
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button aria-label="Cadastrar empresa">
                <BookmarkPlus className="h-4 w-4" />
                Cadastrar
              </Button>
            </DialogTrigger>
            <DialogContent aria-label="Dialog de criação de empresa">
              <form action={createCompany} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="experience_id">Experiência</FieldLabel>
                  <FieldContent>
                    <select id="experience_id" name="experience_id" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                      <option value="">Selecione</option>
                      {experiences.map((e) => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <FieldContent>
                    <TextInput id="name" name="name" required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="role_name">Cargo</FieldLabel>
                  <FieldContent>
                    <TextInput id="role_name" name="role_name" required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="date_start">Início</FieldLabel>
                  <FieldContent>
                    <TextInput id="date_start" name="date_start" type="date" required />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="image_url">Imagem</FieldLabel>
                  <FieldContent>
                    <TextInput id="image_url" name="image_url" placeholder="URL (opcional)" />
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
