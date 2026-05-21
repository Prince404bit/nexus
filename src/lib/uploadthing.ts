import { createUploadthing, type FileRouter } from "uploadthing/next"
import { currentUser } from "@/lib/auth"

const f = createUploadthing()

async function requireAuth() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")
  return { userId: user.id }
}

export const ourFileRouter = {
  profilePhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => requireAuth())
    .onUploadComplete(({ file }) => {
      console.log("Profile photo uploaded:", file.url)
    }),

  postImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .middleware(() => requireAuth())
    .onUploadComplete(({ file }) => {
      console.log("Post image uploaded:", file.url)
    }),

  postVideo: f({ video: { maxFileSize: "64MB", maxFileCount: 1 } })
    .middleware(() => requireAuth())
    .onUploadComplete(({ file }) => {
      console.log("Post video uploaded:", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter