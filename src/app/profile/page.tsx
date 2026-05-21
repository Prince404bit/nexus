import { currentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    include: {
      _count: {
        select: {
          posts: true,
          answers: true,
        },
      },
      posts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          community: { select: { name: true, slug: true } },
        },
      },
    },
  })

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Profile header */}
        <div className="border border-white/10 rounded-2xl p-8 bg-white/5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div style={{width:"80px", height:"80px", borderRadius:"50%", border:"2px solid white", background:"black", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", fontSize:"28px", color:"white"}}>
                {user.firstName?.[0] ?? user.emailAddresses[0].emailAddress[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black">{user.firstName} {user.lastName}</h1>
                <p className="text-gray-400 text-sm mt-1">{user.emailAddresses[0].emailAddress}</p>
                <div className="flex gap-3 mt-3">
                  <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-3 py-1 rounded-full">Member</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/settings" className="text-sm border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white px-4 py-2 rounded-full transition font-medium text-center">
                Edit Profile
              </Link>
              <Link href="/settings" className="text-sm border border-violet-500/30 hover:bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full transition font-medium text-center">
                Change Photo
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Reputation", value: dbUser?.reputation ?? 0 },
            { label: "Posts", value: dbUser?._count?.posts ?? 0 },
            { label: "Answers", value: dbUser?._count?.answers ?? 0 },
            { label: "Accepted", value: 0 },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/10 rounded-xl p-4 bg-white/5 text-center">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent posts */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
          <h2 className="font-black text-lg mb-4">Recent Activity</h2>
          {!dbUser || dbUser.posts.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet. Start posting!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {dbUser.posts.map((post) => (
                <div key={post.id} className="border border-white/10 rounded-xl p-4 bg-white/5 hover:border-white/20 transition">
                  <p className="font-semibold text-white text-sm">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    r/{post.community.slug} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}