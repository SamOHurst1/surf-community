import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(
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

  // Extract storage path from public URL
  const urlObj = new URL(photo.url)
  const storagePath = decodeURIComponent(urlObj.pathname.split('/object/public/profile-photos/')[1])
  await supabaseAdmin.storage.from('profile-photos').remove([storagePath])

  await prisma.profilePhoto.delete({ where: { id: photoId } })

  // If deleted photo was primary, promote the next one
  if (photo.isPrimary) {
    const next = await prisma.profilePhoto.findFirst({
      where: { userId },
      orderBy: { order: 'asc' },
    })
    if (next) {
      await prisma.profilePhoto.update({ where: { id: next.id }, data: { isPrimary: true } })
    }
  }

  // Re-number remaining photos
  const remaining = await prisma.profilePhoto.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })
  await Promise.all(
    remaining.map((p, i) => prisma.profilePhoto.update({ where: { id: p.id }, data: { order: i } }))
  )

  return NextResponse.json({ ok: true })
}
