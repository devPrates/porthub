import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import HeroBanner from "@/components/dashboard/hero_banner"

export default async function ApiKeysPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Faça login para gerenciar chaves.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const keys = await prisma.apiKey.findMany({ where: { user_id: userId } })

  async function createKey(formData: FormData) {
    "use server"
    const description = String(formData.get("description") || "").trim() || null
    const key = randomUUID()
    await prisma.apiKey.create({ data: { user_id: userId, key, description } })
    revalidatePath("/dashboard/settings/api-keys")
  }

  async function toggleKey(id: string, is_active: boolean) {
    "use server"
    await prisma.apiKey.update({ where: { id }, data: { is_active } })
    revalidatePath("/dashboard/settings/api-keys")
  }

  async function deleteKey(id: string) {
    "use server"
    await prisma.apiKey.delete({ where: { id } })
    revalidatePath("/dashboard/settings/api-keys")
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="API Keys" subtitle="Crie e gerencie suas chaves de acesso." />
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Crie e gerencie suas chaves de acesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={createKey} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <FieldContent>
                <Input id="description" name="description" placeholder="Opcional" />
              </FieldContent>
            </Field>
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit">Criar</Button>
            </div>
          </form>
          <Separator />
          <div className="space-y-3">
            {keys.map((k) => (
              <Card key={k.id} className="hover:bg-muted/10">
                <CardHeader>
                  <CardTitle className="text-base">{k.key}</CardTitle>
                  {k.description && <CardDescription>{k.description}</CardDescription>}
                </CardHeader>
                <CardFooter className="flex gap-2 justify-end">
                  <form action={toggleKey.bind(null, k.id, !k.is_active)}>
                    <Button type="submit" variant="secondary" size="sm">{k.is_active ? "Desativar" : "Ativar"}</Button>
                  </form>
                  <form action={deleteKey.bind(null, k.id)}>
                    <Button type="submit" variant="destructive" size="sm">Excluir</Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
            {keys.length === 0 && (
              <FieldError>Nenhuma chave cadastrada</FieldError>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
