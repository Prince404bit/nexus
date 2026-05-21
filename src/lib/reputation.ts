import { db } from "@/lib/db"

type ReputationEventType =
  | "POST_CREATED"
  | "QUESTION_ASKED"
  | "ANSWER_POSTED"
  | "ANSWER_ACCEPTED"
  | "UPVOTE_RECEIVED"
  | "DOWNVOTE_RECEIVED"
  | "UPVOTE_REMOVED"
  | "DOWNVOTE_REMOVED"
  | "VOTE_CHANGED"

export async function awardReputation(
  userId: string,
  type: ReputationEventType,
  sourceId: string,
  points: number
) {
  if (points === 0) return

  await db.$transaction([
    db.reputationEvent.create({
      data: { userId, type, points, sourceId },
    }),
    db.user.update({
      where: { id: userId },
      data: { reputation: { increment: points } },
    }),
  ])
}