import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/lib/uploadthing"

export const metadata: Metadata = {
  title: "Nexus",
  description: "Your expertise deserves an audience",
}

const DEV_MODE = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") !== true

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const inner = (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Navbar />
        {children}
      </body>
    </html>
  )

  if (DEV_MODE) return inner

  const { ClerkProvider } = await import("@clerk/nextjs")
  return <ClerkProvider>{inner}</ClerkProvider>
}
