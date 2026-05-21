import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") ?? ""

    if (query.trim().length < 2) {
      return NextResponse.json({ posts: [], questions: [], communities: [] })
    }

    const [posts, questions, communities] = await Promise.all([
      db.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          author: { select: { username: true } },
          community: { select: { name: true, slug: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      db.question.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          author: { select: { username: true } },
          community: { select: { name: true, slug: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      db.community.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json({ posts, questions, communities })
  } catch (error) {
    console.error("[GET /api/search]", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}