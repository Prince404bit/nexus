import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { db } from "@/lib/db"

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted"
  data: {
    id: string
    email_addresses: { email_address: string; id: string }[]
    username: string | null
    first_name: string | null
    last_name: string | null
    image_url: string
    created_at: number
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing CLERK_WEBHOOK_SECRET" },
      { status: 500 }
    )
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    )
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)
  let event: ClerkUserEvent

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserEvent
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const { type, data } = event

  if (type === "user.created") {
    const email = data.email_addresses[0]?.email_address ?? ""
    const username =
      data.username ?? email.split("@")[0] ?? `user_${data.id.slice(-6)}`

    await db.user.create({
      data: { clerkId: data.id, email, username },
    })

    return NextResponse.json({ message: "User created" }, { status: 201 })
  }

  if (type === "user.updated") {
    const email = data.email_addresses[0]?.email_address ?? ""
    const username = data.username ?? undefined

    await db.user.update({
      where: { clerkId: data.id },
      data: { email, ...(username && { username }) },
    })

    return NextResponse.json({ message: "User updated" }, { status: 200 })
  }

  if (type === "user.deleted") {
    await db.user.delete({ where: { clerkId: data.id } })
    return NextResponse.json({ message: "User deleted" }, { status: 200 })
  }

  return NextResponse.json({ message: "Unhandled event" }, { status: 200 })
}