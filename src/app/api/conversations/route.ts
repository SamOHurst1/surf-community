import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const me = session.user.id

  // Get all messages involving the current user, newest first
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: me }, { receiverId: me }] },
    orderBy: { createdAt: 'desc' },
    include: {
      sender:   { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  })

  // Build one entry per other user (first occurrence = most recent message)
  const seen = new Map<string, {
    userId: string
    name: string
    image: string | null
    lastMessage: string
    timestamp: string
    unread: number
  }>()

  for (const msg of messages) {
    const other = msg.senderId === me ? msg.receiver : msg.sender
    if (!seen.has(other.id)) {
      seen.set(other.id, {
        userId:      other.id,
        name:        other.name ?? 'Surfer',
        image:       other.image,
        lastMessage: msg.body,
        timestamp:   msg.createdAt.toISOString(),
        unread:      0,
      })
    }
    // Count unread messages received from this user
    if (msg.receiverId === me && !msg.read) {
      const entry = seen.get(other.id)!
      entry.unread += 1
    }
  }

  return NextResponse.json([...seen.values()])
}
