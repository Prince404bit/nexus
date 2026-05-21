"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null)
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setOpen(true)
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const hasResults =
    results &&
    (results.posts?.length > 0 ||
      results.questions?.length > 0 ||
      results.communities?.length > 0)

  return (
    <div ref={ref} className="relative w-64">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-violet-500 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hasResults && setOpen(true)}
          placeholder="Search..."
          autoComplete="off"
          className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none w-full"
        />
        {loading && (
          <div className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {open && hasResults && (
        <div className="absolute top-12 left-0 w-80 bg-black border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">

          {results.communities?.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Communities</p>
              {results.communities.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/r/${c.slug}`}
                  onClick={() => { setOpen(false); setQuery("") }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-black text-xs">
                    {c.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-white">r/{c.name}</span>
                </Link>
              ))}
            </div>
          )}

          {results.posts?.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Posts</p>
              {results.posts.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/post/${p.id}`}
                  onClick={() => { setOpen(false); setQuery("") }}
                  className="block px-2 py-1.5 rounded-xl hover:bg-white/5 transition"
                >
                  <p className="text-sm text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">r/{p.community?.slug}</p>
                </Link>
              ))}
            </div>
          )}

          {results.questions?.length > 0 && (
            <div className="p-3">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Questions</p>
              {results.questions.map((q: any) => (
                <Link
                  key={q.id}
                  href={`/questions/${q.id}`}
                  onClick={() => { setOpen(false); setQuery("") }}
                  className="block px-2 py-1.5 rounded-xl hover:bg-white/5 transition"
                >
                  <p className="text-sm text-white truncate">{q.title}</p>
                  <p className="text-xs text-gray-500">r/{q.community?.slug}</p>
                </Link>
              ))}
            </div>
          )}

        </div>
      )}

      {open && !hasResults && query.length >= 2 && !loading && (
        <div className="absolute top-12 left-0 w-80 bg-black border border-white/10 rounded-2xl shadow-2xl z-50 p-4 text-center">
          <p className="text-sm text-gray-500">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}