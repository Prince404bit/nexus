import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { awardReputation } from "@/lib/reputation"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: answerId } = await params

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

    const answer = await db.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    })
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    if (answer.question.authorId !== dbUser.id) {
      return NextResponse.json(
        { error: "Only the question author can accept an answer" },
        { status: 403 }
      )
    }

    if (answer.question.acceptedAnswerId === answerId) {
      await db.question.update({
        where: { id: answer.questionId },
        data: { acceptedAnswerId: null },
      })
      return NextResponse.json({ accepted: false })
    }

    await db.question.update({
      where: { id: answer.questionId },
      data: { acceptedAnswerId: answerId },
    })

    await awardReputation(answer.authorId, "ANSWER_ACCEPTED", answer.id, 15)

    return NextResponse.json({ accepted: true })
  } catch (error) {
    console.error("[PATCH /api/answers/[id]/accept]", error)
    return NextResponse.json(
      { error: "Failed to accept answer" },
      { status: 500 }
    )
  }
}