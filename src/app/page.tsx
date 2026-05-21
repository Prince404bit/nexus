import Link from "next/link"
import { currentUser } from "@/lib/auth"

export default async function Home() {
  const user = await currentUser()

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Glowing blobs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <div className="relative flex flex-col items-center text-center px-6 pt-28 pb-20">
        <h1 className="text-7xl font-black tracking-tighter leading-none mb-6">
          Your expertise
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            deserves an audience
          </span>
        </h1>

        <p className="text-gray-400 text-xl mb-10 max-w-lg leading-relaxed">
          Share what you know. Help someone out. Let the world see who you are.
        </p>

        {!user && (
          <div className="flex gap-3 mb-16">
            <Link href="/sign-up" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-8 py-3.5 rounded-full font-bold text-base transition">
              Get Started
            </Link>
            <Link href="/sign-in" className="border border-white/20 hover:bg-white/5 text-white px-8 py-3.5 rounded-full font-bold text-base transition">
              Sign In
            </Link>
          </div>
        )}

        {user && (
          <div className="flex gap-3 mb-16">
            <Link href="/communities" className="border border-white/20 hover:bg-white/5 text-white px-8 py-3.5 rounded-full font-bold text-base transition">
              Explore Communities
            </Link>
            <Link href="/questions" className="border border-white/20 hover:bg-white/5 text-white px-8 py-3.5 rounded-full font-bold text-base transition">
              Browse Q&A
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-12 text-center border-t border-white/10 pt-10 w-full max-w-lg justify-center">
          <div>
            <p className="text-3xl font-black text-white">10k+</p>
            <p className="text-xs text-gray-500 mt-1">Members</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">500+</p>
            <p className="text-xs text-gray-500 mt-1">Communities</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">50k+</p>
            <p className="text-xs text-gray-500 mt-1">Answers</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 px-16 pb-32">
        <div className="group border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition cursor-pointer">
          <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-2">Communities</p>
          <h3 className="font-bold text-lg mb-2">Find Your People</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Join niche communities and connect with people who actually get what you do.</p>
        </div>
        <div className="group border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/30 transition cursor-pointer">
          <p className="text-xs text-pink-400 font-semibold uppercase tracking-widest mb-2">Knowledge</p>
          <h3 className="font-bold text-lg mb-2">Ask. Get Answered.</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Structured Q&A with accepted answers. Real knowledge that stays useful forever.</p>
        </div>
        <div className="group border border-white/10 rounded-2xl p-6 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition cursor-pointer">
          <p className="text-xs text-orange-400 font-semibold uppercase tracking-widest mb-2">Reputation</p>
          <h3 className="font-bold text-lg mb-2">Build Real Credibility</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Earn reputation that follows you everywhere. Your contributions actually mean something.</p>
        </div>
      </div>

      {/* CTA — only for logged out users */}
      {!user && (
        <div className="mx-16 mb-24 rounded-3xl bg-gradient-to-r from-violet-900/50 to-pink-900/50 border border-white/10 p-16 text-center">
          <p className="text-4xl font-black mb-4">Leave a mark.</p>
          <p className="text-gray-400 mb-8">Be part of a community that actually values what you know.</p>
          <Link href="/sign-up" className="inline-block bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-10 py-4 rounded-full font-black text-lg transition">
            Join Nexus
          </Link>
        </div>
      )}
    </main>
  )
}