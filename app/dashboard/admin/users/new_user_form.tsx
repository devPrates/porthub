"use client"

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { FieldSet, Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { create_user_action, type ActionState } from "./actions"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type NewUserFormProps = {
  onSuccess?: () => void
}

export default function NewUserForm({ onSuccess }: NewUserFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState<ActionState, FormData>(create_user_action, { ok: false, message: "" })

  useEffect(() => {
    if (!state?.message) return
    if (state.ok) {
      toast.success(state.message)
      onSuccess?.()
      router.refresh()
    } else {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-5" aria-label="Formulário de novo usuário">
      <DialogHeader>
        <DialogTitle>Criar Usuário</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para cadastrar um novo usuário. Senhas são armazenadas com hash seguro.
        </DialogDescription>
      </DialogHeader>

      <FieldSet>
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <FieldContent>
            <Input id="name" name="name" placeholder="Nome completo" required aria-required="true" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <FieldContent>
            <Input id="email" name="email" type="email" placeholder="usuario@exemplo.com" required aria-required="true" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <FieldContent>
            <Input id="password" name="password" type="password" minLength={6} placeholder="Mínimo de 6 caracteres" required aria-required="true" />
          </FieldContent>
        </Field>

        <Field>
          <Label htmlFor="role">Perfil</Label>
          <FieldContent>
            <select
              id="role"
              name="role"
              defaultValue="USER"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Selecione o perfil do usuário"
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </FieldContent>
        </Field>
      </FieldSet>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" aria-label="Cancelar criação de usuário">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" aria-label="Salvar novo usuário">Salvar</Button>
      </DialogFooter>
    </form>
  )
}