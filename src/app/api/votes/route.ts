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

    const { postId, type } = await req.json()

    if (!postId || !["UPVOTE", "DOWNVOTE"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid postId or vote type" },
        { status: 400 }
      )
    }

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.authorId === dbUser.id) {
      return NextResponse.json(
        { error: "Cannot vote on your own post" },
        { status: 403 }
      )
    }

    const existingVote = await db.vote.findUnique({
      where: { userId_postId: { userId: dbUser.id, postId } },
    })

    let userVote: "UPVOTE" | "DOWNVOTE" | null = null

    if (!existingVote) {
      await db.vote.create({ data: { type, userId: dbUser.id, postId } })
      userVote = type
      if (type === "UPVOTE") {
        await awardReputation(post.authorId, "UPVOTE_RECEIVED", postId, 10)
      } else {
        await awardReputation(post.authorId, "DOWNVOTE_RECEIVED", postId, -2)
      }
    } else if (existingVote.type === type) {
      await db.vote.delete({
        where: { userId_postId: { userId: dbUser.id, postId } },
      })
      userVote = null
      if (type === "UPVOTE") {
        await awardReputation(post.authorId, "UPVOTE_REMOVED", postId, -10)
      } else {
        await awardReputation(post.authorId, "DOWNVOTE_REMOVED", postId, 2)
      }
    } else {
      await db.vote.update({
        where: { userId_postId: { userId: dbUser.id, postId } },
        data: { type },
      })
      userVote = type
      if (type === "UPVOTE") {
        await awardReputation(post.authorId, "VOTE_CHANGED", postId, 12)
      } else {
        await awardReputation(post.authorId, "VOTE_CHANGED", postId, -12)
      }
    }

    const [upvotes, downvotes] = await db.$transaction([
      db.vote.count({ where: { postId, type: "UPVOTE" } }),
      db.vote.count({ where: { postId, type: "DOWNVOTE" } }),
    ])

    return NextResponse.json({ voteCount: upvotes - downvotes, userVote })
  } catch (error) {
    console.error("[POST /api/votes]", error)
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    )
  }
}