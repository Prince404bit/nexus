import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEV_MODE = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") !== true

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/communities",
  "/r/(.*)",
  "/post/(.*)",
  "/questions",
  "/api/posts(.*)",
  "/api/comments(.*)",
  "/api/communities(.*)",
  "/api/questions(.*)",
  "/api/search(.*)",
  "/api/uploadthing(.*)",
])

const clerk = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})

export default async function proxy(req: NextRequest) {
  if (DEV_MODE) return NextResponse.next()
  return clerk(req, {} as any)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
