import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const photoSeeds: Record<string, { url: string; isPrimary: boolean; order: number }[]> = {
  'joao.silva.seed@surf.community': [
    { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80', isPrimary: true,  order: 0 },
    { url: 'https://images.unsplash.com/photo-1455264745730-cb3b76250887?w=600&q=80', isPrimary: false, order: 1 },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', isPrimary: false, order: 2 },
  ],
  'maria.santos.seed@surf.community': [
    { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80', isPrimary: true,  order: 0 },
    { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80', isPrimary: false, order: 1 },
  ],
}

async function main() {
  for (const [email, photos] of Object.entries(photoSeeds)) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) { console.log(`  ${email} not found, skipping`); continue }

    const existing = await prisma.profilePhoto.count({ where: { userId: user.id } })
    if (existing > 0) { console.log(`  ${email} already has photos, skipping`); continue }

    await prisma.profilePhoto.createMany({
      data: photos.map(p => ({ userId: user.id, ...p })),
    })
    console.log(`  added ${photos.length} photos to ${user.name}`)
  }
  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
