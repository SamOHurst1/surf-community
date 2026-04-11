import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const seedUsers = [
  {
    name: 'João Silva',
    email: 'joao.silva.seed@surf.community',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
    phone: '+351 912 345 678',
    age: 28,
    abilityLevel: 'intermediate',
    boardFeet: 6,
    boardInches: 2,
    location: { name: 'Costa da Caparica', lat: 38.6447, lng: -9.2354 },
    surfConditions: ['Medium waves (3-6ft)', 'Beach breaks', 'Clean conditions'],
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos.seed@surf.community',
    image: 'https://images.unsplash.com/photo-1455264745730-cb3b76250887?w=400&q=80',
    phone: '+351 963 456 789',
    age: 24,
    abilityLevel: 'advanced',
    boardFeet: 5,
    boardInches: 8,
    location: { name: 'Carcavelos', lat: 38.6833, lng: -9.3333 },
    surfConditions: ['Big waves (6ft+)', 'All conditions', 'Reef breaks'],
  },
  {
    name: 'Pedro Costa',
    email: 'pedro.costa.seed@surf.community',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    phone: '+351 934 567 890',
    age: 32,
    abilityLevel: 'expert',
    boardFeet: 6,
    boardInches: 0,
    location: { name: 'Costa da Caparica', lat: 38.6447, lng: -9.2354 },
    surfConditions: ['Big waves (6ft+)', 'Reef breaks', 'Point breaks'],
  },
  {
    name: 'Ana Rodrigues',
    email: 'ana.rodrigues.seed@surf.community',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
    phone: '+351 915 678 901',
    age: 21,
    abilityLevel: 'beginner',
    boardFeet: 8,
    boardInches: 0,
    location: { name: 'Carcavelos', lat: 38.6833, lng: -9.3333 },
    surfConditions: ['Small waves (1-3ft)', 'Beach breaks', 'Clean conditions'],
  },
]

async function main() {
  console.log('Seeding test users...')

  for (const u of seedUsers) {
    // Skip if email already exists
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      console.log(`  skipping ${u.name} (already exists)`)
      continue
    }

    const user = await prisma.user.create({
      data: {
        name:              u.name,
        email:             u.email,
        image:             u.image,
        phone:             u.phone,
        age:               u.age,
        abilityLevel:      u.abilityLevel,
        boardFeet:         u.boardFeet,
        boardInches:       u.boardInches,
        onboardingComplete: true,
        locations: {
          create: {
            name:      u.location.name,
            lat:       u.location.lat,
            lng:       u.location.lng,
            isPrimary: true,
          },
        },
        surfConditions: {
          create: u.surfConditions.map(condition => ({ condition })),
        },
      },
    })

    console.log(`  created ${user.name} (${user.id})`)
  }

  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
