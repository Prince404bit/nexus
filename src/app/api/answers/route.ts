import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { awardReputation } from "@/lib/reputation"

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

    const { content, questionId } = await req.json()

    if (!content || typeof content !== "string" || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Answer must be at least 10 characters" },
        { status: 400 }
      )
    }

    if (!questionId) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      )
    }

    const question = await db.question.findUnique({ where: { id: questionId } })
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const answer = await db.answer.create({
      data: {
        content: content.trim(),
        authorId: dbUser.id,
        questionId,
      },
      include: {
        author: { select: { username: true } },
      },
    })

    await awardReputation(dbUser.id, "ANSWER_POSTED", answer.id, 5)

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error("[POST /api/answers]", error)
    return NextResponse.json(
      { error: "Failed to post answer" },
      { status: 500 }
    )
  }
}