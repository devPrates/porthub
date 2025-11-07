import HeroBanner from "@/components/dashboard/hero_banner"
import { Card, CardContent } from "@/components/ui/card"
import { FolderPlus } from "lucide-react"

export default function NewPortfolioPage() {
  return (
    <div className="container mx-auto space-y-6">
      <HeroBanner
        title="Criar Portifolio"
        subtitle="Preencha os dados iniciais para começar"
        rightIcon={<FolderPlus className="h-6 w-6" aria-hidden="true" />}
      />
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-muted-foreground">
            Em breve: formulário de criação com validação Zod e integração Prisma.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}