"use client"

import { useMemo, useState } from "react"
import { DataTable } from "@/components/dashboard/data_table"
import { columns, type UserRow } from "./columns"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileDown, FileUp, Filter, Plus } from "lucide-react"

export default function UsersDataTable({ data }: { data: UserRow[] }) {
  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((u) =>
      [u.name, u.email].some((v) => v.toLowerCase().includes(q))
    )
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

  return (
    <div className="space-y-3">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Pesquisar por nome ou e-mail..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-[280px]"
            aria-label="Pesquisar usuários"
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
          <Button
            variant="outline"
            size="icon"
            aria-label="Importar usuários"
            className="border-0 bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-100 dark:hover:bg-violet-800 focus-visible:ring-violet-500/30"
          >
            <FileUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Exportar usuários"
            className="border-0 bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-100 dark:hover:bg-violet-800 focus-visible:ring-violet-500/30"
          >
            <FileDown className="h-4 w-4" />
          </Button>
          <Button aria-label="Adicionar usuário">
            <Plus className="h-4 w-4" />
            Novo
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={sorted} />
    </div>
  )
}