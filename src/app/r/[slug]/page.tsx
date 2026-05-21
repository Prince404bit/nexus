import Link from "next/link"
import { VoteButtons } from "@/components/VoteButtons"

type Props = {
  params: Promise<{ slug: string }>
}

async function getPosts(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts?communitySlug=${slug}`,
      { cache: "no-store" }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.posts ?? []
  } catch {
    return []
  }
}

async function getCommunity(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/communities`,
      { cache: "no-store" }
    )
    if (!res.ok) return null
    const communities = await res.json()
    return communities.find((c: any) => c.slug === slug) ?? null
  } catch {
    return null
  }
}

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params
  const [posts, community] = await Promise.all([
    getPosts(slug),
    getCommunity(slug),
  ])

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Community header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-black text-xl">
              {slug[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black">r/{slug}</h1>
              <p className="text-gray-400 text-sm">
                {community?._count?.posts ?? 0} posts · {community?.description || "No description yet."}
              </p>
            </div>
          </div>
          <button className="border border-violet-500/50 text-violet-400 hover:bg-violet-500/10 px-5 py-2 rounded-full text-sm font-bold transition">
            Join
          </button>
        </div>

        {/* Sort bar */}
        <div className="flex gap-2 mb-6">
          {["Hot", "New", "Top", "Answered"].map((sort) => (
            <button key={sort} className="text-sm px-4 py-1.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition">
              {sort}
            </button>
          ))}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No posts yet.</p>
            <Link href="/create-post" className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm">
              Create the First Post
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post: any) => (
              <div key={post.id} className="border border-white/10 rounded-2xl p-5 bg-white/5 hover:border-white/20 transition">
                <div className="flex gap-4">
                  <VoteButtons
                    postId={post.id}
                    initialScore={post.score ?? 0}
                    initialUserVote={null}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        post.type === "QUESTION" ? "bg-violet-500/20 text-violet-400" :
                        post.type === "GUIDE" ? "bg-green-500/20 text-green-400" :
                        "bg-white/10 text-gray-400"
                      }`}>{post.type}</span>
                      <span className="text-xs text-gray-500">
                        by {post.author?.username ?? "unknown"} · {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-bold text-white hover:text-violet-400 cursor-pointer transition">{post.title}</p>
                    {/* Images */}
                    {post.imageUrls?.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {post.imageUrls.map((url: string, i: number) => (
                          <img key={i} src={url} alt="post image" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-3">
                      <button className="text-xs text-gray-500 hover:text-white transition">
                        {post._count?.comments ?? 0} Comments
                      </button>
                      <button className="text-xs text-gray-500 hover:text-white transition">Share</button>
                      <button className="text-xs text-gray-500 hover:text-white transition">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}