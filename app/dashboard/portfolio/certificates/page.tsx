import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import HeroBanner from "@/components/dashboard/hero_banner"
import CertificatesDataTable from "./data_table"

export default async function CertificatesPage() {
  const session = await getSession()
  const userId = (session?.user as any)?.id as string | undefined
  if (!userId) {
    return (
      <main className="container mx-auto">
        <div className="rounded-md border p-4">
          <h2 className="text-lg font-semibold">Certificados</h2>
          <p className="text-sm text-muted-foreground">Faça login para gerenciar certificados.</p>
        </div>
      </main>
    )
  }

  const portfolios = await prisma.portfolio.findMany({ where: { user_id: userId }, include: { experiences: true } })
  const experiences = await prisma.experience.findMany({ where: { portfolio_id: { in: portfolios.map(p => p.id) } } })
  const certificates = await prisma.certificate.findMany({ where: { experience_id: { in: experiences.map(e => e.id) } }, include: { experience: true } })

  const experiencesOptions = experiences.map((e) => ({ id: e.id, title: e.title }))
  const rows = certificates.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type as any,
    hours: c.hours ?? null,
    experience_title: c.experience.title,
    date_end: c.date_end ? c.date_end.toISOString().slice(0, 10) : null,
  }))

  return (
    <main className="container mx-auto space-y-6">
      <HeroBanner title="Certificados" subtitle="Registre certificados associados às suas experiências." />
      <CertificatesDataTable data={rows} experiences={experiencesOptions} />
    </main>
  )
}
