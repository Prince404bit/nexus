import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  return dbUser
}