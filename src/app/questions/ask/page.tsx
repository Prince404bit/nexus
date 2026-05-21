"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AskPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [communitySlug, setCommunitySlug] = useState("")
  const [tags, setTags] = useState("")
  const [communities, setCommunities] = useState<{name: string, slug: string}[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/communities")
      .then((res) => res.json())
      .then((data) => setCommunities(data))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (title.trim().length < 10) {
      setError("Title must be at least 10 characters.")
      return
    }
    if (content.trim().length < 20) {
      setError("Details must be at least 20 characters.")
      return
    }
    if (!communitySlug) {
      setError("Please select a community.")
      return
    }

    setLoading(true)

    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          communitySlug,
          tags: parsedTags,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      router.push("/questions")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-2xl mx-auto">

        <Link href="/questions" className="text-sm text-gray-500 hover:text-white transition flex items-center gap-1.5 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Q&A
        </Link>

        <h1 className="text-4xl font-black mb-2">Ask a Question</h1>
        <p className="text-gray-400 mb-10">Be specific. The more detail you give, the better answers you get.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question? Be specific."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Details</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain your problem in detail. Include what you've already tried."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Community</label>
            <select
              value={communitySlug}
              onChange={(e) => setCommunitySlug(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition"
            >
              <option value="">Select a community</option>
              {communities.map((c) => (
                <option key={c.slug} value={c.slug}>r/{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. nextjs, prisma, typescript (up to 5 tags)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
            />
            <p className="text-xs text-gray-600 mt-1.5">Separate tags with commas.</p>
          </div>

          {error && (
            <p className="text-sm text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
            <Link href="/questions" className="text-sm text-gray-500 hover:text-white transition px-4 py-3">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </main>
  )
}