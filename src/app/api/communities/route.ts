import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") ?? ""

    const communities = await db.community.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: {
        _count: { select: { posts: true, questions: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(communities)
  } catch (error) {
    console.error("[GET /api/communities]", error)
    return NextResponse.json(
      { error: "Failed to fetch communities" },
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

    const { name, description } = await req.json()

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Community name must be at least 3 characters" },
        { status: 400 }
      )
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const existing = await db.community.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: "A community with this name already exists" },
        { status: 409 }
      )
    }

    const community = await db.community.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() ?? "",
      },
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error) {
    console.error("[POST /api/communities]", error)
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    )
  }
}