import { currentUser as clerkCurrentUser } from "@clerk/nextjs/server"

const DEV_MODE = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") !== true

const mockUser = {
  id: "dev_user_001",
  firstName: "Dev",
  lastName: "User",
  emailAddresses: [{ emailAddress: "dev@localhost.com", id: "email_1" }],
  username: "devuser",
  imageUrl: "",
}

export async function currentUser() {
  if (DEV_MODE) return mockUser as any
  return clerkCurrentUser()
}
