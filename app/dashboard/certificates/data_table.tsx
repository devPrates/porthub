"use client"
import { useMemo, useState } from "react"
import { DataTable } from "@/components/dashboard/data_table"
import { columns, type CertificateRow } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, BookmarkPlus } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { createCertificate } from "./actions"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"

export default function CertificatesDataTable({ data, experiences }: { data: CertificateRow[]; experiences: { id: string; title: string }[] }) {
  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((c) => [c.name, c.type, c.experience_title].some((v) => String(v ?? "").toLowerCase().includes(q)))
  }, [data, query])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const aTime = new Date(a.date_end || Date.now()).getTime()
      const bTime = new Date(b.date_end || Date.now()).getTime()
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
            placeholder="Pesquisar por nome, tipo ou experiência..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[300px]"
            aria-label="Pesquisar certificados"
          />
          <Button
            variant="outline"
            aria-label={sortAsc ? "Ordenar por conclusão ascendente" : "Ordenar por conclusão descendente"}
            title={sortAsc ? "Ordenar por conclusão ascendente" : "Ordenar por conclusão descendente"}
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button aria-label="Cadastrar certificado">
                <BookmarkPlus className="h-4 w-4" />
                Cadastrar
              </Button>
            </DialogTrigger>
            <DialogContent aria-label="Dialog de criação de certificado">
              <form action={createCertificate} className="space-y-4">
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
                    <Input id="name" name="name" required minLength={2} maxLength={120} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="type">Tipo</FieldLabel>
                  <FieldContent>
                    <select id="type" name="type" className="w-full rounded-md border bg-background px-3 py-2 text-sm" required>
                      <option value="CURSO">Curso</option>
                      <option value="FORMACAO">Formação</option>
                    </select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="hours">Horas</FieldLabel>
                  <FieldContent>
                    <Input id="hours" name="hours" type="number" min={0} placeholder="Opcional" />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="date_end">Conclusão</FieldLabel>
                  <FieldContent>
                    <Input id="date_end" name="date_end" type="date" />
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
