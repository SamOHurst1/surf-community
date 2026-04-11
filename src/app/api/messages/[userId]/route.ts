import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const me = session.user.id
  const { userId } = await params

  // Fetch thread between the two users
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: me,     receiverId: userId },
        { senderId: userId, receiverId: me },
      ],
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id:        true,
      body:      true,
      senderId:  true,
      createdAt: true,
    },
  })

  // Mark received messages as read
  await prisma.message.updateMany({
    where: { senderId: userId, receiverId: me, read: false },
    data:  { read: true },
  })

  return NextResponse.json(
    messages.map(m => ({
      id:        m.id,
      content:   m.body,
      sender:    m.senderId === me ? 'me' : 'them',
      timestamp: m.createdAt.toISOString(),
    }))
  )
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const me = session.user.id
  const { userId } = await params
  const { body } = await req.json()

  if (!body?.trim()) {
    return NextResponse.json({ error: 'Message body is required' }, { status: 400 })
  }

  // Verify recipient exists
  const recipient = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!recipient) {
    return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
  }

  const message = await prisma.message.create({
    data: { senderId: me, receiverId: userId, body: body.trim() },
    select: { id: true, body: true, createdAt: true },
  })

  return NextResponse.json({
    id:        message.id,
    content:   message.body,
    sender:    'me',
    timestamp: message.createdAt.toISOString(),
  })
}
