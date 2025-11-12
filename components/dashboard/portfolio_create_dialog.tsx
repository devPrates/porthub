"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createPortfolio } from "@/app/dashboard/portfolio/actions"

export default function PortfolioCreateDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await createPortfolio(formData)
        setOpen(false)
      } catch (e: any) {
        setError(e?.message ?? "Falha ao criar portfólio")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Criar novo portfólio">Criar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Portfólio</DialogTitle>
          <DialogDescription>Preencha os campos para criar seu portfólio</DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="title">Título</FieldLabel>
            <FieldContent>
              <Input id="title" name="title" placeholder="Ex.: Meu Portfólio" required minLength={3} maxLength={120} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="subtitle">Subtítulo</FieldLabel>
            <FieldContent>
              <Input id="subtitle" name="subtitle" placeholder="Opcional" maxLength={180} />
            </FieldContent>
          </Field>

          {error && <FieldError>{error}</FieldError>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} aria-label="Cancelar">Cancelar</Button>
            <Button type="submit" disabled={isPending} aria-label="Criar">
              {isPending ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
