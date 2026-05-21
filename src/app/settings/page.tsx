"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { UploadButton } from "@/components/uploader"

const AVATARS = [
  { id: 1, url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Bella&backgroundColor=b6e3f4" },
  { id: 2, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Peach" },
  { id: 3, url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Lily&backgroundColor=ffd5dc" },
  { id: 4, url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Luna&backgroundColor=ffd5dc" },
  { id: 5, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mango" },
  { id: 6, url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Rose&backgroundColor=b6e3f4" },
  { id: 7, url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Mochi&backgroundColor=d1f4d1" },
  { id: 8, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Berry" },
  { id: 9, url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Daisy&backgroundColor=d1f4d1" },
  { id: 10, url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Kiki&backgroundColor=e8d5f4" },
  { id: 11, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sunny" },
  { id: 12, url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Violet&backgroundColor=e8d5f4" },
  { id: 13, url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Nova&backgroundColor=ffecd2" },
  { id: 14, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cookie" },
  { id: 15, url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Poppy&backgroundColor=ffecd2" },
  { id: 16, url: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Coco&backgroundColor=c2f0f0" },
  { id: 17, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pudding" },
  { id: 18, url: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Ivy&backgroundColor=c2f0f0" },
]

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [saved, setSaved] = useState(false)
  const [photoTab, setPhotoTab] = useState<"avatar" | "upload">("avatar")
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: "left" | "right") {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" })
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <main className="min-h-screen bg-black text-white px-16 py-12">
      <div className="max-w-xl mx-auto">

        <Link href="/profile" className="text-sm text-gray-500 hover:text-white transition flex items-center gap-1.5 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Profile
        </Link>

        <h1 className="text-4xl font-black mb-2">Settings</h1>
        <p className="text-gray-400 mb-10">Manage your profile and preferences.</p>

        <form onSubmit={handleSave} className="flex flex-col gap-8">

          {/* Profile Photo */}
          <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex flex-col gap-5">
            <h2 className="font-black text-lg">Profile Photo</h2>

            {/* Tab switcher */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhotoTab("avatar")}
                className={`text-sm px-4 py-1.5 rounded-full border transition font-medium ${
                  photoTab === "avatar"
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 border-transparent text-white"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Choose Avatar
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab("upload")}
                className={`text-sm px-4 py-1.5 rounded-full border transition font-medium ${
                  photoTab === "upload"
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 border-transparent text-white"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Upload Photo
              </button>
            </div>

            {/* Avatar slider */}
            {photoTab === "avatar" && (
              <div>
                <p className="text-xs text-gray-500 mb-3">Scroll to explore all avatars</p>
                <div className="flex items-center gap-2">
                  {/* Left arrow */}
                  <button
                    type="button"
                    onClick={() => scroll("left")}
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>

                  {/* Scrollable row */}
                  <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide flex-1"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 transition ring-2 ring-offset-2 ring-offset-black ${
                          selectedAvatar === av.id ? "ring-violet-500" : "ring-transparent hover:ring-white/30"
                        }`}
                      >
                        <img src={av.url} alt={`Avatar ${av.id}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Right arrow */}
                  <button
                    type="button"
                    onClick={() => scroll("right")}
                    className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>

                {/* Selected preview */}
                {selectedAvatar && (
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={AVATARS.find(a => a.id === selectedAvatar)?.url}
                      alt="Selected"
                      className="w-12 h-12 rounded-full border-2 border-violet-500"
                    />
                    <p className="text-xs text-violet-400 font-semibold">Avatar selected! Save to apply.</p>
                  </div>
                )}
              </div>
            )}

            {/* Photo upload */}
            {photoTab === "upload" && (
              <div>
                <p className="text-xs text-gray-500 mb-3">Upload a photo from your device</p>
                <UploadButton
                  endpoint="profilePhoto"
                  onClientUploadComplete={(res) => {
                    setUploadedPhoto(res[0].url)
                  }}
                  onUploadError={(error) => {
                    alert("Upload failed: " + error.message)
                  }}
                  appearance={{
                    button: "bg-gradient-to-r from-violet-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm",
                    allowedContent: "text-gray-500 text-xs mt-1",
                  }}
                />
                {uploadedPhoto && (
                  <img src={uploadedPhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white mt-3" />
                )}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex flex-col gap-5">
            <h2 className="font-black text-lg">Profile Info</h2>

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How should people know you?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the community about yourself."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">{bio.length}/160 characters</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          {/* Account */}
          <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex flex-col gap-4">
            <h2 className="font-black text-lg">Account</h2>
            <p className="text-sm text-gray-400">
              Email and password changes are managed through Clerk.{" "}
              <a href="https://accounts.clerk.dev/user" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                Manage Account
              </a>
            </p>
          </div>

          {/* Danger Zone */}
          <div className="border border-pink-500/20 rounded-2xl p-6 bg-pink-500/5 flex flex-col gap-4">
            <h2 className="font-black text-lg text-pink-400">Danger Zone</h2>
            <p className="text-sm text-gray-400">Permanently delete your account and all your data. This cannot be undone.</p>
            <button type="button" className="w-fit text-sm border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 px-5 py-2 rounded-full transition font-bold">
              Delete Account
            </button>
          </div>

          {/* Save */}
          <div className="flex gap-3 items-center">
            <button type="submit" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition">
              Save Changes
            </button>
            <Link href="/profile" className="text-sm text-gray-500 hover:text-white transition px-4 py-3">
              Cancel
            </Link>
            {saved && (
              <span className="text-sm text-green-400 font-semibold">Changes saved.</span>
            )}
          </div>

        </form>
      </div>
    </main>
  )
}