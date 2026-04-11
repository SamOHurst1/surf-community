import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const body = await request.json()

  const {
    name,
    phone,
    age,
    abilityLevel,
    boardFeet,
    boardInches,
    onboardingComplete,
    location,
    surfConditions,
  } = body

  // Build scalar update object — only include fields present in the request
  const scalarUpdate: Record<string, unknown> = {}
  if (name !== undefined) scalarUpdate.name = name
  if (phone !== undefined) scalarUpdate.phone = phone
  if (age !== undefined) scalarUpdate.age = age
  if (abilityLevel !== undefined) scalarUpdate.abilityLevel = abilityLevel
  if (boardFeet !== undefined) scalarUpdate.boardFeet = boardFeet
  if (boardInches !== undefined) scalarUpdate.boardInches = boardInches
  if (onboardingComplete !== undefined) scalarUpdate.onboardingComplete = onboardingComplete

  await prisma.$transaction(async (tx) => {
    if (Object.keys(scalarUpdate).length > 0) {
      await tx.user.update({ where: { id: userId }, data: scalarUpdate })
    }

    if (location) {
      // Replace existing locations with the new primary one
      await tx.userLocation.deleteMany({ where: { userId } })
      await tx.userLocation.create({
        data: {
          userId,
          name: location.name,
          lat: location.lat,
          lng: location.lng,
          isPrimary: true,
        },
      })
    }

    if (surfConditions) {
      // Replace existing conditions
      await tx.userSurfCondition.deleteMany({ where: { userId } })
      await tx.userSurfCondition.createMany({
        data: surfConditions.map((condition: string) => ({ userId, condition })),
      })
    }
  })

  return NextResponse.json({ ok: true })
}
