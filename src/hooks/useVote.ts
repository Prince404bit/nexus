"use client"

import { useState, useTransition, useEffect } from "react"

type VoteType = "UPVOTE" | "DOWNVOTE"

interface UseVoteProps {
  postId: string
  initialScore: number
  initialUserVote: VoteType | null
}

export function useVote({ postId, initialScore, initialUserVote }: UseVoteProps) {
  const [score, setScore] = useState(initialScore)
  const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote)
  const [isPending, startTransition] = useTransition()

  // Sync when navigating to a different post without full remount
  useEffect(() => {
    setScore(initialScore)
    setUserVote(initialUserVote)
  }, [postId])

  const vote = (type: VoteType) => {
    const prevScore = score
    const prevVote = userVote

    if (userVote === type) {
      setScore((s) => (type === "UPVOTE" ? s - 1 : s + 1))
      setUserVote(null)
    } else if (userVote !== null) {
      setScore((s) => (type === "UPVOTE" ? s + 2 : s - 2))
      setUserVote(type)
    } else {
      setScore((s) => (type === "UPVOTE" ? s + 1 : s - 1))
      setUserVote(type)
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, type }),
        })

        if (!res.ok) {
          setScore(prevScore)
          setUserVote(prevVote)
          return
        }

        const data = await res.json()
        setScore(data.voteCount)
        setUserVote(data.userVote)
      } catch {
        setScore(prevScore)
        setUserVote(prevVote)
      }
    })
  }

  return { score, userVote, vote, isPending }
}