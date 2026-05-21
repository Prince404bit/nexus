import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { awardReputation } from "@/lib/reputation"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const communitySlug = searchParams.get("communitySlug")
    const tag = searchParams.get("tag")
    const cursor = searchParams.get("cursor")
    const search = searchParams.get("search") ?? ""
    const limit = 20

    const questions = await db.question.findMany({
      where: {
        ...(communitySlug && { community: { slug: communitySlug } }),
        ...(tag && { tags: { has: tag } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    })

    const nextCursor =
      questions.length === limit ? questions[questions.length - 1].id : null

    return NextResponse.json({ questions, nextCursor })
  } catch (error) {
    console.error("[GET /api/questions]", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
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

    const { title, content, communitySlug, tags } = await req.json()

    if (!title || typeof title !== "string" || title.trim().length < 10) {
      return NextResponse.json(
        { error: "Question title must be at least 10 characters" },
        { status: 400 }
      )
    }

    if (!content || typeof content !== "string" || content.trim().length < 20) {
      return NextResponse.json(
        { error: "Question body must be at least 20 characters" },
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

    const sanitizedTags: string[] = Array.isArray(tags)
      ? tags
          .slice(0, 5)
          .map((t: string) =>
            t.toLowerCase().trim().replace(/[^a-z0-9-]/g, "")
          )
          .filter(Boolean)
      : []

    const question = await db.question.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: dbUser.id,
        communityId: community.id,
        tags: sanitizedTags,
      },
      include: {
        author: { select: { username: true } },
        community: { select: { name: true, slug: true } },
      },
    })

    await awardReputation(dbUser.id, "QUESTION_ASKED", question.id, 3)

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error("[POST /api/questions]", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}