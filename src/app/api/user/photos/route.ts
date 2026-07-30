import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const photos = await prisma.profilePhoto.findMany({
    where: { userId: session.user.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(photos)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  const count = await prisma.profilePhoto.count({ where: { userId } })
  if (count >= 3) {
    return NextResponse.json({ error: 'Maximum 3 photos allowed' }, { status: 400 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('profile-photos')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('profile-photos')
    .getPublicUrl(path)

  const photo = await prisma.profilePhoto.create({
    data: { userId, url: publicUrl, isPrimary: count === 0, order: count },
  })

  return NextResponse.json(photo)
}
