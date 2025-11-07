"use client"

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { FieldSet, Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { update_user_action, type ActionState } from "./actions"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type EditUserFormProps = {
  user: {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
  }
  onSuccess?: () => void
}

export default function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState<ActionState, FormData>(update_user_action, { ok: false, message: "" })

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
    <form action={formAction} className="space-y-5" aria-label="Formulário de edição de usuário">
      <input type="hidden" name="id" value={user.id} />

      <DialogHeader>
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogDescription>
          Atualize as informações do usuário. Para manter a senha atual, deixe o campo de senha vazio.
        </DialogDescription>
      </DialogHeader>

      <FieldSet>
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <FieldContent>
            <Input id="name" name="name" defaultValue={user.name} required aria-required="true" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <FieldContent>
            <Input id="email" name="email" type="email" defaultValue={user.email} required aria-required="true" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <FieldContent>
            <Input id="password" name="password" type="password" minLength={6} placeholder="Deixe vazio para manter" aria-required="false" />
          </FieldContent>
        </Field>

        <Field>
          <Label htmlFor="role">Perfil</Label>
          <FieldContent>
            <select
              id="role"
              name="role"
              defaultValue={user.role}
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
          <Button variant="outline" type="button" aria-label="Cancelar edição">Cancelar</Button>
        </DialogClose>
        <Button type="submit" aria-label="Salvar alterações">Salvar</Button>
      </DialogFooter>
    </form>
  )
}