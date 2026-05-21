"use client"

import { useVote } from "@/hooks/useVote"

interface VoteButtonsProps {
  postId: string
  initialScore: number
  initialUserVote: "UPVOTE" | "DOWNVOTE" | null
}

export function VoteButtons({
  postId,
  initialScore,
  initialUserVote,
}: VoteButtonsProps) {
  const { score, userVote, vote, isPending } = useVote({
    postId,
    initialScore,
    initialUserVote,
  })

  return (
    <div className="flex flex-col items-center gap-1 min-w-[32px]">
      <button
        onClick={() => vote("UPVOTE")}
        disabled={isPending}
        className={`transition text-lg ${
          userVote === "UPVOTE"
            ? "text-violet-400"
            : "text-gray-500 hover:text-violet-400"
        } disabled:opacity-50`}
      >
        ▲
      </button>
      <span className="text-sm font-bold">{score}</span>
      <button
        onClick={() => vote("DOWNVOTE")}
        disabled={isPending}
        className={`transition text-lg ${
          userVote === "DOWNVOTE"
            ? "text-pink-400"
            : "text-gray-500 hover:text-pink-400"
        } disabled:opacity-50`}
      >
        ▼
      </button>
    </div>
  )
}