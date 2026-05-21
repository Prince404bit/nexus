import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
        _count: { select: { comments: true, votes: true } },
        votes: { select: { type: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const { votes, ...postData } = post
    const score =
      votes.filter((v) => v.type === "UPVOTE").length -
      votes.filter((v) => v.type === "DOWNVOTE").length

    return NextResponse.json({ ...postData, score })
  } catch (error) {
    console.error("[GET /api/posts/[id]]", error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}