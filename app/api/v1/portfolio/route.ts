import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateApiKey } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? ""
  const validated = await validateApiKey(apiKey)
  if (!validated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userId } = validated
  const portfolio = await prisma.portfolio.findFirst({
    where: { user_id: userId },
    include: {
      hero: { include: { technologies: { include: { technology: true } } } },
      about: { include: { technologies: { include: { technology: true } } } },
      projects: { include: { project: { include: { technologies: { include: { technology: true } } } } } },
      experiences: {
        include: {
          companies: { include: { technologies: { include: { technology: true } } } },
          certificates: true,
        },
      },
      socials: true,
      pages: true,
    },
  })

  if (!portfolio) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  return NextResponse.json({ portfolio }, { status: 200 })
}
