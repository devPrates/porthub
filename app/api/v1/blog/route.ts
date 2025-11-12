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
  const blog = await prisma.blog.findFirst({
    where: { user_id: userId },
    include: {
      categories: true,
      posts: { include: { category: true } },
    },
  })

  if (!blog) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }

  return NextResponse.json({ blog }, { status: 200 })
}
