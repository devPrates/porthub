import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { toSlug } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import HeroBanner from "@/components/dashboard/hero_banner"
import { redirect } from "next/navigation"

export default async function NovoPortfolioPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto space-y-6">
        <HeroBanner title="Cadastrar Portfólio" subtitle="Faça login para continuar" />
        <Card>
          <CardHeader>
            <CardTitle>Permissão necessária</CardTitle>
            <CardDescription>Você precisa estar autenticado para cadastrar um portfólio.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  async function createPortfolio(formData: FormData) {
    "use server"
    const title = String(formData.get("title") || "").trim()
    const subtitle = String(formData.get("subtitle") || "").trim() || null
    if (!title || title.length < 3) throw new Error("Informe um título válido")
    const slug = toSlug(title)
    await prisma.portfolio.create({ data: { user_id: userId, title, subtitle, slug } })
    redirect(`/dashboard/portfolio/${slug}`)
  }

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Cadastrar Portfólio" subtitle="Defina o título e subtítulo do seu portfólio" />
      <Card>
        <CardHeader>
          <CardTitle>Novo Portfólio</CardTitle>
          <CardDescription>Preencha os campos abaixo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={createPortfolio} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <FieldContent>
                <Input id="title" name="title" required minLength={3} maxLength={120} placeholder="Ex.: Meu Portfólio" />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="subtitle">Subtítulo</FieldLabel>
              <FieldContent>
                <Input id="subtitle" name="subtitle" placeholder="Opcional" />
              </FieldContent>
            </Field>
            <div className="flex justify-end">
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
