import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    const comments = await db.comment.findMany({
      where: { postId },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("[GET /api/comments]", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    })
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { content, postId } = await req.json()

    if (!content || typeof content !== "string" || content.trim().length < 1) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      )
    }

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 })
    }

    const post = await db.post.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        authorId: dbUser.id,
        postId,
      },
      include: { author: { select: { username: true } } },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("[POST /api/comments]", error)
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    )
  }
}