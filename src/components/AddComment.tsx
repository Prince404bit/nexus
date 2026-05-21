"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddComment({ postId }: { postId: string }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (content.trim().length < 1) {
      setError("Comment cannot be empty.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      setContent("")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
      <h2 className="font-black text-lg mb-4">Your Answer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your answer..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition resize-none"
        />
        {error && (
          <p className="text-sm text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold transition text-sm w-fit disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Answer"}
        </button>
      </form>
    </div>
  )
}