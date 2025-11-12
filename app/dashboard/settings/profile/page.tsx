import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"
import HeroBanner from "@/components/dashboard/hero_banner"

export default async function SettingsProfilePage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Faça login para editar seu perfil.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  async function saveProfile(formData: FormData) {
    "use server"
    const name = String(formData.get("name") || "").trim()
    const avatar_url = String(formData.get("avatar_url") || "").trim() || null
    const bio = String(formData.get("bio") || "").trim() || null
    if (!name) throw new Error("Informe o nome")
    await prisma.user.update({ where: { id: userId }, data: { name, avatar_url, bio } })
    revalidatePath("/dashboard/settings/profile")
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Perfil" subtitle="Atualize seu nome, avatar e bio." />
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Atualize seu nome, avatar e bio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <FieldContent>
                <Input id="name" name="name" defaultValue={user?.name ?? ""} required />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="avatar_url">Avatar URL</FieldLabel>
              <FieldContent>
                <Input id="avatar_url" name="avatar_url" defaultValue={user?.avatar_url ?? ""} />
              </FieldContent>
            </Field>
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <FieldContent>
                <Input id="bio" name="bio" defaultValue={user?.bio ?? ""} />
              </FieldContent>
            </Field>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
