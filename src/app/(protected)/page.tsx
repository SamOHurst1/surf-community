'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, MapPin, Compass, Waves, Target, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Surfer {
  id: string
  name: string
  image: string | null
  location: string | null
  abilityLevel: string
  boardFeet: number | null
  boardInches: number | null
  surfConditions: string[]
  surfStatus: string | null
  joinedAt: string
}

const filters = [
  { id: 'all',           label: 'All',          icon: Users },
  { id: 'nearby',        label: 'Nearby',        icon: MapPin },
  { id: 'similar-level', label: 'Similar Level', icon: Target },
  { id: 'conditions',    label: 'Conditions',    icon: Waves },
]

const levelStyle: Record<string, { dot: string; text: string }> = {
  beginner:     { dot: '#34d399', text: 'text-emerald-400' },
  intermediate: { dot: '#38bdf8', text: 'text-sky-400' },
  advanced:     { dot: '#a78bfa', text: 'text-violet-400' },
  expert:       { dot: '#fbbf24', text: 'text-amber-400' },
}

const levelRank: Record<string, number> = {
  beginner: 1, intermediate: 2, advanced: 3, expert: 4,
}

function boardSizeLabel(feet: number | null, inches: number | null) {
  if (!feet) return null
  return `${feet}'${String(inches ?? 0).padStart(2, '0')}"`
}

function joinedLabel(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days === 0) return 'Joined today'
  if (days === 1) return 'Joined yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function DiscoverPage() {
  const [surfers, setSurfers]         = useState<Surfer[]>([])
  const [myProfile, setMyProfile]     = useState<{ location: string | null; abilityLevel: string | null; surfConditions: string[] } | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/surfers').then(r => r.json()),
      fetch('/api/user/me').then(r => r.json()),
    ]).then(([surferData, me]) => {
      setSurfers(Array.isArray(surferData) ? surferData : [])
      setMyProfile(me)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = (() => {
    if (activeFilter === 'nearby') {
      return surfers.filter(s => s.location && myProfile?.location && s.location === myProfile.location)
    }
    if (activeFilter === 'similar-level') {
      const myRank = levelRank[myProfile?.abilityLevel?.toLowerCase() ?? ''] ?? 0
      return surfers.filter(s => {
        const rank = levelRank[s.abilityLevel.toLowerCase()] ?? 0
        return myRank > 0 && Math.abs(rank - myRank) <= 1
      })
    }
    if (activeFilter === 'conditions') {
      const myConds = new Set(myProfile?.surfConditions ?? [])
      return surfers.filter(s => s.surfConditions.some(c => myConds.has(c)))
    }
    return surfers
  })()

  const viewProfile = (surfer: Surfer) => {
    window.location.href = `/surfers/${surfer.id}`
  }

  const startConversation = (surfer: Surfer) => {
    window.location.href = `/messages?userId=${surfer.id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
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
            <p className="font-[family-name:var(--font-syne)] font-700 text-lg text-foreground">
              {surfers.length === 0 ? 'No other surfers yet' : 'No surfers match this filter'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {surfers.length === 0 ? 'Share the app with your surf crew' : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((surfer, i) => {
              const level    = levelStyle[surfer.abilityLevel.toLowerCase()]
              const board    = boardSizeLabel(surfer.boardFeet, surfer.boardInches)
              const initials = surfer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
              return (
                <div
                  key={surfer.id}
                  className="card-enter card-glow-hover group rounded-2xl overflow-hidden cursor-pointer border border-border/60 grain"
                  style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.02 252) 100%)', animationDelay: `${i * 60}ms` }}
                  onClick={() => viewProfile(surfer)}
                >
                  {/* Photo / Avatar */}
                  <div className="relative overflow-hidden" style={{ height: i === 0 ? '17rem' : '14rem' }}>
                    {surfer.image ? (
                      <img
                        src={surfer.image}
                        alt={surfer.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                           style={{ background: 'linear-gradient(135deg, oklch(0.16 0.03 248) 0%, oklch(0.12 0.025 252) 100%)' }}>
                        <Avatar className="h-24 w-24">
                          <AvatarFallback className="text-3xl font-[family-name:var(--font-syne)] font-700"
                                          style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0"
                         style={{ background: 'linear-gradient(to top, oklch(0.07 0.025 248 / 0.9) 0%, oklch(0.07 0.025 248 / 0.3) 40%, transparent 70%)' }} />

                    {/* Joined chip */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.06em] px-2.5 py-1 rounded-full border border-white/10"
                            style={{ background: 'oklch(0.07 0.02 248 / 0.7)', backdropFilter: 'blur(8px)', color: 'oklch(0.96 0.008 240 / 0.7)' }}>
                        {joinedLabel(surfer.joinedAt)}
                      </span>
                    </div>

                    {/* Name over photo */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {level && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: level.dot }} />
                          <span className={`text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.1em] uppercase ${level.text}`}>
                            {surfer.abilityLevel}
                          </span>
                        </div>
                      )}
                      <p className="font-[family-name:var(--font-syne)] font-700 text-xl tracking-tight text-white leading-tight">
                        {surfer.name}
                      </p>
                      {surfer.location && (
                        <div className="flex items-center gap-1 mt-1 text-white/55 text-xs">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          {surfer.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 pt-3.5">
                    {/* Status badge */}
                    {surfer.surfStatus && (
                      <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg"
                           style={{ background: 'oklch(0.76 0.175 192 / 0.08)', border: '1px solid oklch(0.76 0.175 192 / 0.2)' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'oklch(0.76 0.175 192)' }} />
                        <span className="text-[10px] font-[family-name:var(--font-syne)] font-600 truncate" style={{ color: 'oklch(0.76 0.175 192)' }}>
                          {surfer.surfStatus}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-xs text-muted-foreground font-300">
                        {board ? `${board} board` : 'Board size unknown'}
                      </span>
                      <div className="flex gap-1.5">
                        {surfer.surfConditions.slice(0, 2).map(c => (
                          <span key={c} className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-md border border-border/50"
                                style={{ background: 'oklch(0.16 0.02 248)' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

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
