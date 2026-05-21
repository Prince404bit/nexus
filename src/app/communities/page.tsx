import Link from "next/link"

async function getCommunities() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/communities`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function CommunitiesPage() {
  const communities = await getCommunities()

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Communities</h1>
            <p className="text-gray-400 mt-2">Find your people. Join the conversation.</p>
          </div>
          <Link href="/communities/create" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-5 py-2.5 rounded-full font-bold text-sm transition">
            + Create Community
          </Link>
        </div>

        {communities.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-4">No communities yet.</p>
            <Link href="/communities/create" className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-sm">
              Create the First One
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {communities.map((c: any) => (
              <Link href={`/r/${c.slug}`} key={c.slug} className="border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center font-black text-sm">
                    {c.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">r/{c.name}</p>
                    <p className="text-xs text-gray-500">{c._count?.posts ?? 0} posts · {c._count?.questions ?? 0} questions</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{c.description || "No description yet."}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}