"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UploadButton } from "@/components/uploader"

const POST_TYPES = ["Post", "Question", "Guide"]

export default function CreatePostPage() {
  const router = useRouter()
  const [activeType, setActiveType] = useState("Post")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [communitySlug, setCommunitySlug] = useState("")
  const [communities, setCommunities] = useState<{name: string, slug: string}[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)
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

    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.")
      return
    }
    if (!communitySlug) {
      setError("Please select a community.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          communitySlug,
          type: activeType.toUpperCase(),
          imageUrls: uploadedImages,
          videoUrl: uploadedVideo,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }

      router.push(`/r/${communitySlug}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-2xl mx-auto">

        <Link href="/" className="text-sm text-gray-500 hover:text-white transition flex items-center gap-1.5 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </Link>

        <h1 className="text-4xl font-black mb-2">Create a Post</h1>
        <p className="text-gray-400 mb-8">Share something worth reading.</p>

        <div className="flex gap-3 mb-8">
          {POST_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`text-sm px-4 py-2 rounded-full border transition font-medium ${
                activeType === type
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 border-transparent text-white"
                  : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Content</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something worth reading..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Photos (optional)</label>
            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <UploadButton
                endpoint="postImage"
                onClientUploadComplete={(res) => {
                  setUploadedImages(res.map((f) => f.url))
                }}
                onUploadError={(error) => {
                  alert("Upload failed: " + error.message)
                }}
                appearance={{
                  button: "bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm",
                  allowedContent: "text-gray-500 text-xs mt-1",
                }}
              />
              {uploadedImages.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {uploadedImages.map((url, i) => (
                    <img key={i} src={url} alt="upload" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Video (optional)</label>
            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <UploadButton
                endpoint="postVideo"
                onClientUploadComplete={(res) => {
                  setUploadedVideo(res[0].url)
                }}
                onUploadError={(error) => {
                  alert("Upload failed: " + error.message)
                }}
                appearance={{
                  button: "bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm",
                  allowedContent: "text-gray-500 text-xs mt-1",
                }}
              />
              {uploadedVideo && (
                <video src={uploadedVideo} controls className="mt-3 w-full rounded-xl border border-white/10" />
              )}
            </div>
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
              {loading ? "Publishing..." : "Publish Post"}
            </button>
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition px-4 py-3">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </main>
  )
}