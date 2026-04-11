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
      phoneVisible: true,
      surfStatus: true,
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
    phoneVisible:   user.phoneVisible,
    surfStatus:     user.surfStatus,
  })
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const me = session.user.id
  const body = await request.json()
  const { phone, phoneVisible, abilityLevel, boardFeet, boardInches, surfConditions, location, surfStatus } = body

  await prisma.$transaction(async tx => {
    // Scalar user fields
    const userUpdate: Record<string, unknown> = {}
    if (phone !== undefined)        userUpdate.phone        = phone ?? null
    if (phoneVisible !== undefined) userUpdate.phoneVisible = phoneVisible
    if (abilityLevel !== undefined) userUpdate.abilityLevel = abilityLevel
    if (boardFeet !== undefined)    userUpdate.boardFeet    = boardFeet
    if (boardInches !== undefined)  userUpdate.boardInches  = boardInches
    if (surfStatus !== undefined)   userUpdate.surfStatus   = surfStatus ?? null

    if (Object.keys(userUpdate).length > 0) {
      await tx.user.update({ where: { id: me }, data: userUpdate })
    }

    // Replace surf conditions
    if (surfConditions !== undefined) {
      await tx.userSurfCondition.deleteMany({ where: { userId: me } })
      if (surfConditions.length > 0) {
        await tx.userSurfCondition.createMany({
          data: surfConditions.map((condition: string) => ({ userId: me, condition })),
        })
      }
    }

    // Replace primary location
    if (location !== undefined) {
      await tx.userLocation.deleteMany({ where: { userId: me, isPrimary: true } })
      if (location) {
        await tx.userLocation.create({
          data: { userId: me, name: location, lat: 0, lng: 0, isPrimary: true },
        })
      }
    }
  })

  return NextResponse.json({ ok: true })
}
