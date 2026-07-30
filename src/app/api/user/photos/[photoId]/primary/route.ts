import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { photoId } = await params
  const userId = session.user.id

  const photo = await prisma.profilePhoto.findUnique({ where: { id: photoId } })
  if (!photo || photo.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.$transaction([
    prisma.profilePhoto.updateMany({ where: { userId }, data: { isPrimary: false } }),
    prisma.profilePhoto.update({ where: { id: photoId }, data: { isPrimary: true } }),
  ])

  return NextResponse.json({ ok: true })
}
