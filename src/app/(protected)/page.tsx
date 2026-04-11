'use client'

import { useState } from 'react'
import { MessageCircle, MapPin, Compass, Waves, Target, Users } from 'lucide-react'

interface Surfer {
  id: string
  firstName: string
  lastName: string
  location: string
  abilityLevel: string
  boardSize: string
  surfConditions: string[]
  photos: string[]
  favoriteBreaks: string[]
  lastActive: string
}

const mockSurfers: Surfer[] = [
  { id: '1', firstName: 'João', lastName: 'Silva', location: 'Costa da Caparica', abilityLevel: 'Intermediate', boardSize: "6'2\"", surfConditions: ['Medium waves', 'Clean conditions'], photos: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80'], favoriteBreaks: ['Costa da Caparica', 'Carcavelos'], lastActive: '2h ago' },
  { id: '2', firstName: 'Maria', lastName: 'Santos', location: 'Carcavelos', abilityLevel: 'Advanced', boardSize: "5'8\"", surfConditions: ['Large waves', 'All conditions'], photos: ['https://images.unsplash.com/photo-1455264745730-cb3b76250887?w=800&q=80'], favoriteBreaks: ['Carcavelos', 'Nazaré'], lastActive: '1h ago' },
  { id: '3', firstName: 'Pedro', lastName: 'Costa', location: 'Nazaré', abilityLevel: 'Expert', boardSize: "6'0\"", surfConditions: ['Large waves', 'Reef breaks'], photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'], favoriteBreaks: ['Nazaré', 'Supertubos'], lastActive: '30m ago' },
  { id: '4', firstName: 'Ana', lastName: 'Rodrigues', location: 'Peniche', abilityLevel: 'Intermediate', boardSize: "5'10\"", surfConditions: ['Medium waves', 'Point breaks'], photos: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80'], favoriteBreaks: ['Supertubos', 'Baleal'], lastActive: '3h ago' },
  { id: '5', firstName: 'Lucas', lastName: 'Ferreira', location: 'Costa da Caparica', abilityLevel: 'Beginner', boardSize: "8'0\"", surfConditions: ['Small waves', 'Beach breaks'], photos: ['https://images.unsplash.com/photo-1477013743164-ffc3a5e556da?w=800&q=80'], favoriteBreaks: ['Costa da Caparica'], lastActive: '5h ago' },
  { id: '6', firstName: 'Sofia', lastName: 'Mendes', location: 'Ericeira', abilityLevel: 'Advanced', boardSize: "6'4\"", surfConditions: ['Medium waves', 'Point breaks'], photos: ['https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80'], favoriteBreaks: ["Ribeira d'Ilhas", 'Coxos'], lastActive: '20m ago' },
]

const filters = [
  { id: 'all',           label: 'All',          icon: Users },
  { id: 'nearby',        label: 'Nearby',        icon: MapPin },
  { id: 'same-break',    label: 'Same Break',    icon: Waves },
  { id: 'similar-level', label: 'Similar Level', icon: Target },
]

const levelStyle: Record<string, { dot: string; text: string }> = {
  Beginner:     { dot: '#34d399', text: 'text-emerald-400' },
  Intermediate: { dot: '#38bdf8', text: 'text-sky-400' },
  Advanced:     { dot: '#a78bfa', text: 'text-violet-400' },
  Expert:       { dot: '#fbbf24', text: 'text-amber-400' },
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered =
    activeFilter === 'all'           ? mockSurfers
    : activeFilter === 'nearby'      ? mockSurfers.filter(s => ['Costa da Caparica', 'Carcavelos'].includes(s.location))
    : activeFilter === 'same-break'  ? mockSurfers.filter(s => s.favoriteBreaks.some(b => ['Costa da Caparica', 'Carcavelos'].includes(b)))
    : mockSurfers.filter(s => ['Intermediate', 'Advanced'].includes(s.abilityLevel))

  const startConversation = (surfer: Surfer) => {
    const convs = JSON.parse(localStorage.getItem('conversations') || '[]')
    if (!convs.find((c: { surferId: string }) => c.surferId === surfer.id)) {
      convs.push({ id: Date.now().toString(), surferId: surfer.id, surferName: `${surfer.firstName} ${surfer.lastName}`, surferPhoto: surfer.photos[0] || '', lastMessage: '', timestamp: new Date().toISOString(), unread: false })
      localStorage.setItem('conversations', JSON.stringify(convs))
    }
    window.location.href = '/messages'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-8 lg:py-10">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="font-[family-name:var(--font-syne)] text-[10px] font-600 tracking-[0.2em] uppercase text-primary mb-2">
              Surf Community
            </p>
            <h1 className="font-[family-name:var(--font-syne)] font-800 text-4xl lg:text-5xl tracking-[-0.02em] text-foreground leading-none">
              Discover
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mb-1 hidden sm:block">
            {filtered.length} surfer{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-7">
          {filters.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase whitespace-nowrap border transition-all duration-150 ${
                activeFilter === id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground'
              }`}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <Compass className="h-10 w-10 text-primary/20 mb-4" />
            <p className="font-[family-name:var(--font-syne)] font-700 text-lg text-foreground">No surfers here</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((surfer, i) => {
              const level = levelStyle[surfer.abilityLevel]
              return (
                <div
                  key={surfer.id}
                  className="card-enter card-glow-hover group rounded-2xl overflow-hidden cursor-pointer border border-border/60 grain"
                  style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.02 252) 100%)' }}
                  onClick={() => startConversation(surfer)}
                >
                  {/* Photo */}
                  <div className="relative overflow-hidden" style={{ height: i === 0 ? '17rem' : '14rem' }}>
                    <img
                      src={surfer.photos[0]}
                      alt={`${surfer.firstName} ${surfer.lastName}`}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0"
                         style={{ background: 'linear-gradient(to top, oklch(0.07 0.025 248 / 0.9) 0%, oklch(0.07 0.025 248 / 0.3) 40%, transparent 70%)' }} />

                    {/* Last active chip */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.06em] px-2.5 py-1 rounded-full border border-white/10"
                            style={{ background: 'oklch(0.07 0.02 248 / 0.7)', backdropFilter: 'blur(8px)', color: 'oklch(0.96 0.008 240 / 0.7)' }}>
                        {surfer.lastActive}
                      </span>
                    </div>

                    {/* Name over photo */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: level?.dot }} />
                        <span className={`text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.1em] uppercase ${level?.text}`}>
                          {surfer.abilityLevel}
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-syne)] font-700 text-xl tracking-tight text-white leading-tight">
                        {surfer.firstName} {surfer.lastName}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-white/55 text-xs">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        {surfer.location}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 pt-3.5">
                    {/* Board + conditions row */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-xs text-muted-foreground font-300">{surfer.boardSize} board</span>
                      <div className="flex gap-1.5">
                        {surfer.surfConditions.slice(0, 2).map(c => (
                          <span key={c} className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-md border border-border/50"
                                style={{ background: 'oklch(0.16 0.02 248)' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={e => { e.stopPropagation(); startConversation(surfer) }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase border transition-all duration-150"
                      style={{
                        background: 'oklch(0.76 0.175 192 / 0.08)',
                        borderColor: 'oklch(0.76 0.175 192 / 0.2)',
                        color: 'oklch(0.76 0.175 192)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.76 0.175 192)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.07 0.025 248)'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.76 0.175 192)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'oklch(0.76 0.175 192 / 0.08)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.76 0.175 192)'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.76 0.175 192 / 0.2)'
                      }}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Message
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
