import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const surfers = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
      onboardingComplete: true,
    },
    select: {
      id: true,
      name: true,
      image: true,
      abilityLevel: true,
      boardFeet: true,
      boardInches: true,
      createdAt: true,
      locations: {
        where: { isPrimary: true },
        select: { name: true },
        take: 1,
      },
      surfConditions: {
        select: { condition: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const result = surfers.map(s => ({
    id:             s.id,
    name:           s.name ?? 'Surfer',
    image:          s.image,
    abilityLevel:   s.abilityLevel ?? '',
    boardFeet:      s.boardFeet,
    boardInches:    s.boardInches,
    location:       s.locations[0]?.name ?? null,
    surfConditions: s.surfConditions.map(c => c.condition),
    joinedAt:       s.createdAt.toISOString(),
  }))

  return NextResponse.json(result)
}
