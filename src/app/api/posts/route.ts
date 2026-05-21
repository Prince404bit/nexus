import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { awardReputation } from "@/lib/reputation"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const communitySlug = searchParams.get("communitySlug")
    const cursor = searchParams.get("cursor")
    const limit = 20

    const posts = await db.post.findMany({
      where: communitySlug
        ? { community: { slug: communitySlug } }
        : {},
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
        _count: { select: { comments: true, votes: true } },
        votes: { select: { type: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    })

    const postsWithScore = posts.map(({ votes, ...post }) => ({
      ...post,
      score:
        votes.filter((v) => v.type === "UPVOTE").length -
        votes.filter((v) => v.type === "DOWNVOTE").length,
    }))

    const nextCursor =
      posts.length === limit ? posts[posts.length - 1].id : null

    return NextResponse.json({ posts: postsWithScore, nextCursor })
  } catch (error) {
    console.error("[GET /api/posts]", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

    const { title, content, type, communitySlug } = await req.json()

    if (!title || typeof title !== "string" || title.trim().length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      )
    }

    if (!communitySlug) {
      return NextResponse.json(
        { error: "Community is required" },
        { status: 400 }
      )
    }

    const community = await db.community.findUnique({
      where: { slug: communitySlug },
    })
    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      )
    }

    const validTypes = ["TEXT", "LINK", "IMAGE", "VIDEO"]
    const postType = validTypes.includes(type) ? type : "TEXT"

    const post = await db.post.create({
      data: {
        title: title.trim(),
        content: content?.trim() ?? "",
        type: postType,
        authorId: dbUser.id,
        communityId: community.id,
      },
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
      },
    })

    await awardReputation(dbUser.id, "POST_CREATED", post.id, 5)

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("[POST /api/posts]", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}