# Surf Community — Build Plan

## Recommended Tech Stack (additions)

| Layer | Tool | Why |
|-------|------|-----|
| **Database** | [Supabase](https://supabase.com) (PostgreSQL) | Free tier, built-in real-time, file storage, easy to self-host later |
| **ORM** | [Prisma](https://prisma.io) | Best-in-class TypeScript support, great with Next.js |
| **File storage** | Supabase Storage | Already in Supabase, handles profile photos |
| **Real-time** | Supabase Realtime | Live messaging via PostgreSQL change events, no extra service needed |
| **Email** | [Resend](https://resend.com) | Simple API, generous free tier, works well with Next.js |
| **Deployment** | [Vercel](https://vercel.com) | Zero-config for Next.js, free tier covers early stage |

> Keep everything already in the project: Next.js, NextAuth, Tailwind, Radix UI, react-hook-form, zod, Google Maps.

---

## Phase 1 — Database & Auth Foundation
*Everything else depends on this.*

### 1.1 Set up Supabase project
- Create Supabase project, get `DATABASE_URL` and `DIRECT_URL`
- Add env vars to `.env.local` and Vercel

### 1.2 Install and configure Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### 1.3 Define the schema
Key models needed:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  phone         String?
  age           Int?
  abilityLevel  String?   // beginner | intermediate | advanced | expert
  boardFeet     Int?
  boardInches   Int?
  createdAt     DateTime  @default(now())

  locations     UserLocation[]
  surfConditions UserSurfCondition[]
  sentMessages  Message[]  @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
  accounts      Account[]
  sessions      Session[]
}

model UserLocation {
  id        String  @id @default(cuid())
  userId    String
  name      String  // "Costa da Caparica"
  lat       Float
  lng       Float
  isPrimary Boolean @default(false)
  user      User    @relation(fields: [userId], references: [id])
}

model UserSurfCondition {
  id        String  @id @default(cuid())
  userId    String
  condition String  // "Small waves", "Big waves", etc.
  user      User    @relation(fields: [userId], references: [id])
}

model Message {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  body       String
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
}

// NextAuth required models
model Account { ... }
model Session { ... }
model VerificationToken { ... }
```

### 1.4 Connect NextAuth to Prisma
- Install `@auth/prisma-adapter`
- Update `src/lib/auth-config.ts` to use the Prisma adapter
- This persists OAuth accounts and sessions to the database automatically

### 1.5 Migrate onboarding to save to DB
- Replace all `localStorage` writes in onboarding steps with API calls (`/api/user/onboarding`)
- Create `PATCH /api/user/profile` route to save profile data

---

## Phase 2 — API Routes
*Build the server layer for all features.*

### 2.1 User profile API
- `GET /api/user/me` — fetch current user's full profile
- `PATCH /api/user/me` — update profile fields
- `POST /api/user/onboarding` — save onboarding step data

### 2.2 Surfer discovery API
- `GET /api/surfers` — return real users with optional filters:
  - `?filter=nearby` — users sharing a location
  - `?filter=same-break` — users at same surf spots
  - `?filter=similar-level` — users with same ability level
- Replace hardcoded mock data on the home page with this endpoint

### 2.3 Messages API
- `GET /api/messages` — list all conversations for current user
- `GET /api/messages/[userId]` — get thread with a specific user
- `POST /api/messages/[userId]` — send a message
- Wire up the Send button in `/messages`

### 2.4 Photo upload API
- `POST /api/user/avatar` — upload to Supabase Storage, save URL to User record
- Replace base64-in-localStorage with real URLs

---

## Phase 3 — Real-time Messaging
*Make the messages page feel live.*

### 3.1 Enable Supabase Realtime on the messages table
- Turn on replication for the `Message` table in Supabase dashboard

### 3.2 Add real-time subscription in the messages page
```typescript
// Subscribe to new messages for the current user
supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'Message',
    filter: `receiverId=eq.${userId}`
  }, (payload) => {
    // append new message to state
  })
  .subscribe()
```

### 3.3 Unread badge on navbar
- Show count of unread messages in the navbar
- Mark messages as read when conversation is opened

---

## Phase 4 — Polish & Missing Features

### 4.1 Email/password auth
- Implement credential-based sign up using NextAuth `CredentialsProvider`
- Hash passwords with `bcryptjs`
- Remove the `TODO` in `signup.tsx`

### 4.2 Onboarding gate
- After OAuth login, check if the user has completed onboarding
- If not, redirect to `/onboarding` before showing the app
- Add an `onboardingComplete` boolean to the User model

### 4.3 Surfer profiles
- Clicking a surfer card on the home page should open their profile (`/surfers/[id]`)
- Show their locations, conditions, ability level, board size

### 4.4 Expand surf spots
- Replace 3 hardcoded Portuguese spots with a proper `SurfSpot` table
- Seed with a reasonable list of spots
- Let users search/select from the list during onboarding

### 4.5 Fix: unused mobile component
- Remove `src/app/onboarding/mobile/mobile.tsx` (unused duplicate)

---

## Phase 5 — Deployment

### 5.1 Deploy to Vercel
- Connect GitHub repo to Vercel
- Add all env vars (Supabase, NextAuth, Google Maps, OAuth credentials)
- Set `NEXTAUTH_URL` to the production domain

### 5.2 Set up Supabase for production
- Enable row-level security (RLS) policies so users can only read/write their own data
- Set up Supabase Storage bucket with public read, authenticated write

### 5.3 Rotate secrets
- Generate a strong `NEXTAUTH_SECRET` for production
- Use separate OAuth app credentials for production vs. development

---

## Suggested Order of Work

```
Phase 1 (foundation) → Phase 2 (APIs) → Phase 4.2 (onboarding gate)
→ Phase 3 (real-time) → Phase 4 (polish) → Phase 5 (deploy)
```

Phases 1 and 2 unlock everything else. Do those first.
