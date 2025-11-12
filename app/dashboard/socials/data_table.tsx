"use client"
import { useMemo, useState } from "react"
import { DataTable } from "@/components/dashboard/data_table"
import { columns, type SocialRow } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, BookmarkPlus } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { createSocial } from "./actions"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"

export default function SocialsDataTable({ data, portfolios }: { data: SocialRow[]; portfolios: { id: string; title: string }[] }) {
  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((s) => [s.name, s.url, s.portfolio_title].some((v) => String(v ?? "").toLowerCase().includes(q)))
  }, [data, query])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const av = a.name.toLowerCase()
      const bv = b.name.toLowerCase()
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return arr
  }, [filtered, sortAsc])

  const [openNew, setOpenNew] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Pesquisar por nome, URL ou portfólio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[300px]"
            aria-label="Pesquisar redes"
          />
          <Button
            variant="outline"
            aria-label={sortAsc ? "Ordenar por nome ascendente" : "Ordenar por nome descendente"}
            title={sortAsc ? "Ordenar por nome ascendente" : "Ordenar por nome descendente"}
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button aria-label="Cadastrar social link">
                <BookmarkPlus className="h-4 w-4" />
                Cadastrar
              </Button>
            </DialogTrigger>
            <DialogContent aria-label="Dialog de criação de social link">
              <form action={createSocial} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="portfolio_id">Portfólio</FieldLabel>
                  <FieldContent>
                    <select id="portfolio_id" name="portfolio_id" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                      <option value="">Selecione</option>
                      {portfolios.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <FieldContent>
                    <Input id="name" name="name" required />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="url">URL</FieldLabel>
                  <FieldContent>
                    <Input id="url" name="url" type="url" required />
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
