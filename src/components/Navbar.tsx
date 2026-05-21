import Link from "next/link"
import { currentUser } from "@/lib/auth"
import { SearchBar } from "@/components/SearchBar"

export default async function Navbar() {
  const user = await currentUser()

  return (
    <nav className="px-8 py-4 flex items-center justify-between border-b border-white/10 bg-black/90 backdrop-blur-sm sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 via-pink-500 to-orange-400 flex items-center justify-center font-black text-sm text-white">N</div>
        <span className="font-black text-xl tracking-tight text-white">Nexus</span>
        <span className="text-[10px] bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-medium ml-1">Beta</span>
      </div>

      {/* Nav links — only when logged in */}
      {user && (
        <div className="flex items-center gap-6">
          <Link href="/communities" className="text-sm font-medium text-gray-400 hover:text-white transition">Communities</Link>
          <Link href="/questions" className="text-sm font-medium text-gray-400 hover:text-white transition">Q&A</Link>
        </div>
      )}

      {/* Search */}
      {user && <SearchBar />}

      {/* Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/create-post" className="flex items-center gap-1.5 text-sm bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-4 py-2 rounded-full font-bold transition">
              + Create Post
            </Link>
            <Link href="/profile" style={{width:"36px", height:"36px", borderRadius:"50%", border:"2px solid white", background:"black", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", fontSize:"14px", color:"white", textDecoration:"none"}}>
              {user.firstName?.[0] ?? user.emailAddresses[0].emailAddress[0].toUpperCase()}
            </Link>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="text-sm font-medium text-gray-400 hover:text-white transition">Log In</Link>
            <Link href="/sign-up" className="text-sm bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-4 py-2 rounded-full font-bold transition">Join Free</Link>
          </>
        )}
      </div>

    </nav>
  )
}