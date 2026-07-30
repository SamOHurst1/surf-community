import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id, onboardingComplete: true },
    select: {
      id:           true,
      name:         true,
      image:        true,
      phone:        true,
      phoneVisible: true,
      age:          true,
      abilityLevel: true,
      boardFeet:    true,
      boardInches:  true,
      surfStatus:   true,
      createdAt:    true,
      locations: {
        where: { isPrimary: true },
        select: { name: true },
        take: 1,
      },
      surfConditions: {
        select: { condition: true },
      },
      photos: {
        orderBy: { order: 'asc' as const },
        select: { id: true, url: true, isPrimary: true, order: true },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    id:             user.id,
    name:           user.name ?? 'Surfer',
    image:          user.photos.find(p => p.isPrimary)?.url ?? user.photos[0]?.url ?? user.image,
    photos:         user.photos,
    phone:          user.phoneVisible ? user.phone : null,
    age:            user.age,
    abilityLevel:   user.abilityLevel,
    boardFeet:      user.boardFeet,
    boardInches:    user.boardInches,
    location:       user.locations[0]?.name ?? null,
    surfConditions: user.surfConditions.map(s => s.condition),
    surfStatus:     user.surfStatus,
    joinedAt:       user.createdAt.toISOString(),
  })
}
