"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateCommunityPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const slugPreview = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (name.trim().length < 3) {
      setError("Community name must be at least 3 characters.")
      return
    }
    if (name.trim().length > 40) {
      setError("Community name must be 40 characters or fewer.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      router.push(`/r/${data.slug}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="absolute top-32 left-1/3 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto relative">

        <Link href="/communities" className="text-sm text-gray-500 hover:text-white transition flex items-center gap-1.5 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Communities
        </Link>

        <h1 className="text-4xl font-black mb-2">Create a Community</h1>
        <p className="text-gray-400 mb-10">Build a space for people who share your interests.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Community Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. webdev, machinelearning, designsystems"
              maxLength={40}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
            />
            {slugPreview && (
              <p className="text-xs text-gray-500 mt-2">
                Your community will be at{" "}
                <span className="text-violet-400 font-semibold">r/{slugPreview}</span>
              </p>
            )}
            <p className="text-xs text-gray-600 mt-1">{name.length}/40 characters</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community about? Who should join?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition resize-none"
            />
            <p className="text-xs text-gray-600 mt-1">Optional — you can add this later.</p>
          </div>

          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-xs font-semibold text-gray-300 mb-1">Community Guidelines</p>
            <ul className="text-xs text-gray-500 flex flex-col gap-1 list-disc list-inside">
              <li>Names must be unique and lowercase</li>
              <li>No impersonation of existing communities</li>
              <li>Keep it relevant and respectful</li>
            </ul>
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
              {loading ? "Creating..." : "Create Community"}
            </button>
            <Link href="/communities" className="text-sm text-gray-500 hover:text-white transition px-4 py-3">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </main>
  )
}