import { VoteButtons } from "@/components/VoteButtons"
import { AddComment } from "@/components/AddComment"
import Link from "next/link"

type Props = {
  params: Promise<{ id: string }>
}

async function getPost(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`,
      { cache: "no-store" }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getComments(postId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/comments?postId=${postId}`,
      { cache: "no-store" }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const [post, comments] = await Promise.all([
    getPost(id),
    getComments(id),
  ])

  if (!post) {
    return (
      <main className="min-h-screen bg-black text-white px-16 py-12">
        <div className="max-w-3xl mx-auto text-center py-24">
          <p className="text-gray-400 text-lg">Post not found.</p>
          <Link href="/" className="text-violet-400 hover:text-violet-300 text-sm mt-4 inline-block">
            Go Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Post */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5 mb-6">
          <div className="flex gap-4">
            <VoteButtons
              postId={post.id}
              initialScore={post.score ?? 0}
              initialUserVote={null}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full font-semibold">
                  {post.type}
                </span>
                <span className="text-xs text-gray-500">
                  by {post.author?.username ?? "unknown"} · {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl font-black mb-4">{post.title}</h1>
              <p className="text-gray-300 leading-relaxed">{post.content}</p>

              {/* Images */}
              {post.imageUrls?.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {post.imageUrls.map((url: string, i: number) => (
                    <img key={i} src={url} alt="post image" className="w-48 h-48 object-cover rounded-xl border border-white/10" />
                  ))}
                </div>
              )}

              {/* Video */}
              {post.videoUrl && (
                <video src={post.videoUrl} controls className="mt-4 w-full rounded-xl border border-white/10" />
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <h2 className="font-black text-lg mb-4">{comments.length} Comments</h2>
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="border border-white/10 rounded-2xl p-5 bg-white/5">
                  <p className="text-xs text-gray-500 mb-2">
                    by {comment.author?.username ?? "unknown"} · {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add comment */}
        <AddComment postId={post.id} />

      </div>
    </main>
  )
}