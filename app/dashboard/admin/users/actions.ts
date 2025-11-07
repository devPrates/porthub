"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import { Role } from "@prisma/client"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export type ActionState = {
  ok: boolean
  message: string
}

export async function create_user_action(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession()
  const roleSession = (session?.user as any)?.role

  if (roleSession !== "ADMIN") {
    return { ok: false, message: "Acesso negado" }
  }

  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const roleRaw = String(formData.get("role") || "USER").toUpperCase()

  if (!name || !email || !password) {
    return { ok: false, message: "Nome, e-mail e senha são obrigatórios" }
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "E-mail inválido" }
  }

  const role: Role = roleRaw === "ADMIN" ? Role.ADMIN : Role.USER

  try {
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
      },
    })
    revalidatePath("/dashboard/admin/users")
    return { ok: true, message: "Usuário criado com sucesso" }
  } catch (error) {
    return { ok: false, message: "Falha ao criar usuário" }
  }
}

export async function update_user_action(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession()
  const roleSession = (session?.user as any)?.role

  if (roleSession !== "ADMIN") {
    return { ok: false, message: "Acesso negado" }
  }

  const id = String(formData.get("id") || "").trim()
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "")
  const roleRaw = String(formData.get("role") || "USER").toUpperCase()

  if (!id || !name || !email) {
    return { ok: false, message: "ID, nome e e-mail são obrigatórios" }
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "E-mail inválido" }
  }

  const role: Role = roleRaw === "ADMIN" ? Role.ADMIN : Role.USER

  try {
    const data: Record<string, any> = { name, email, role }
    if (password && password.length >= 6) {
      data.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id },
      data,
    })
    revalidatePath("/dashboard/admin/users")
    return { ok: true, message: "Usuário atualizado com sucesso" }
  } catch (error) {
    return { ok: false, message: "Falha ao atualizar usuário" }
  }
}

export async function delete_user_action(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession()
  const roleSession = (session?.user as any)?.role

  if (roleSession !== "ADMIN") {
    return { ok: false, message: "Acesso negado" }
  }

  const id = String(formData.get("id") || "").trim()
  if (!id) {
    return { ok: false, message: "ID do usuário é obrigatório" }
  }

  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath("/dashboard/admin/users")
    return { ok: true, message: "Usuário excluído com sucesso" }
  } catch (error) {
    return { ok: false, message: "Falha ao excluir usuário" }
  }
}