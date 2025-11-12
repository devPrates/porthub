"use client"
import { useState, useTransition, ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Sparkles, BookmarkPlus, Layout as LayoutIcon, FolderKanban, Briefcase, Building, Award, Share2, FileText, BookOpen, Tags, Code2 } from "lucide-react"

interface CreateCardProps {
  title: string
  description?: string
  iconName?: "layout" | "folderKanban" | "briefcase" | "building" | "award" | "share2" | "fileText" | "bookOpen" | "tags" | "code2"
  action: (formData: FormData) => Promise<void>
  children: ReactNode
  buttonLabel?: string
}

export default function CreateCard({ title, description, iconName = "layout", action, children, buttonLabel = "Cadastrar" }: CreateCardProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function onSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await action(formData)
        setOpen(false)
      } catch (e: any) {
        setError(e?.message ?? "Falha ao criar")
      }
    })
  }

  const iconMap = {
    layout: LayoutIcon,
    folderKanban: FolderKanban,
    briefcase: Briefcase,
    building: Building,
    award: Award,
    share2: Share2,
    fileText: FileText,
    bookOpen: BookOpen,
    tags: Tags,
    code2: Code2,
  } as const
  const AutoIcon = iconMap[iconName] ?? LayoutIcon
  return (
    <Card className="relative overflow-hidden max-w-[22rem] border-indigo-500/30 bg-linear-to-b from-indigo-500/10 via-transparent to-purple-500/10 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all">
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10" />
      <CardHeader className="flex-row items-center gap-3">
        <div className="h-11 w-11 flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-600">
          <AutoIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <CardTitle className="text-base leading-tight">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button aria-label={buttonLabel} className="w-full">
              <BookmarkPlus />
              {buttonLabel}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <form action={onSubmit} className="space-y-4">
              {children}
              {error && <FieldError>{error}</FieldError>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} aria-label="Cancelar">Cancelar</Button>
                <Button type="submit" disabled={isPending} aria-label={buttonLabel}>
                  {isPending ? "Salvando..." : buttonLabel}
                </Button>
              </DialogFooter>
            </form>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Use um título claro para gerar um slug amigável.</span>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
