import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DEV_MODE = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") !== true

// Dynamically use Clerk only in production
export default async function proxy(req: NextRequest) {
  if (DEV_MODE) return NextResponse.next()

  const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server")

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

  return clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) await auth.protect()
  })(req, {} as any)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
