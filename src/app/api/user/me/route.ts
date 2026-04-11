import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      phone: true,
      age: true,
      abilityLevel: true,
      boardFeet: true,
      boardInches: true,
      locations: {
        where: { isPrimary: true },
        select: { name: true },
        take: 1,
      },
      surfConditions: {
        select: { condition: true },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    name:           user.name,
    email:          user.email,
    image:          user.image,
    phone:          user.phone,
    age:            user.age,
    abilityLevel:   user.abilityLevel,
    boardFeet:      user.boardFeet,
    boardInches:    user.boardInches,
    location:       user.locations[0]?.name ?? null,
    surfConditions: user.surfConditions.map(s => s.condition),
  })
}
