'use client'

import { useEffect, useState } from 'react'
import { Waves, MapPin, Ruler, Phone, Calendar, PenLine } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserProfile {
  name: string | null
  email: string | null
  image: string | null
  phone: string | null
  age: number | null
  abilityLevel: string | null
  boardFeet: number | null
  boardInches: number | null
  location: string | null
  surfConditions: string[]
}

const levelStyle: Record<string, { dot: string; text: string; bg: string }> = {
  beginner:     { dot: '#34d399', text: 'text-emerald-400', bg: 'oklch(0.76 0.175 165 / 0.12)' },
  intermediate: { dot: '#38bdf8', text: 'text-sky-400',     bg: 'oklch(0.76 0.175 215 / 0.12)' },
  advanced:     { dot: '#a78bfa', text: 'text-violet-400',  bg: 'oklch(0.76 0.175 285 / 0.12)' },
  expert:       { dot: '#fbbf24', text: 'text-amber-400',   bg: 'oklch(0.76 0.175 80  / 0.12)' },
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  const name     = profile?.name ?? 'Surfer'
  const image    = profile?.image ?? undefined
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const level    = (profile?.abilityLevel ?? '').toLowerCase()
  const lStyle   = levelStyle[level]
  const boardSize = profile?.boardFeet
    ? `${profile.boardFeet}'${String(profile.boardInches ?? 0).padStart(2, '0')}"`
    : null

  const stats = [
    boardSize              ? { icon: Ruler,    label: 'Board',      value: boardSize }                                          : null,
    profile?.age           ? { icon: Calendar, label: 'Age',        value: String(profile.age) }                               : null,
    (profile?.surfConditions.length ?? 0) > 0 ? { icon: Waves, label: 'Conditions', value: String(profile!.surfConditions.length) } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 py-8 lg:py-10 space-y-4">

        {/* ── Hero card ── */}
        <div className="relative rounded-2xl overflow-hidden border border-border/60 grain"
             style={{ background: 'linear-gradient(160deg, oklch(0.14 0.025 248) 0%, oklch(0.10 0.02 252) 100%)' }}>

          {/* Cover gradient */}
          <div className="h-28 relative overflow-hidden">
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(135deg, oklch(0.76 0.175 192 / 0.25) 0%, oklch(0.76 0.175 230 / 0.1) 50%, oklch(0.13 0.022 248 / 0) 100%)' }} />
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 112" fill="none" preserveAspectRatio="none">
              <path d="M0 60 Q100 20 200 60 T400 60" stroke="oklch(0.76 0.175 192)" strokeWidth="1" fill="none" />
              <path d="M0 80 Q100 40 200 80 T400 80" stroke="oklch(0.76 0.175 192)" strokeWidth="0.5" fill="none" />
            </svg>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-5">
              <Avatar className="h-[88px] w-[88px] shadow-xl" style={{ boxShadow: '0 0 0 3px oklch(0.13 0.022 248), 0 0 0 5px oklch(0.76 0.175 192 / 0.25)' }}>
                <AvatarImage src={image} />
                <AvatarFallback className="text-2xl font-[family-name:var(--font-syne)] font-800"
                                style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/60 text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                <PenLine className="h-3 w-3" />
                Edit
              </button>
            </div>

            {/* Name + email */}
            <h1 className="font-[family-name:var(--font-syne)] font-700 text-2xl tracking-tight text-foreground leading-tight">{name}</h1>
            {profile?.email && (
              <p className="text-[13px] text-muted-foreground mt-0.5 font-300">{profile.email}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {lStyle && (
                <span className={`flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase px-3 py-1.5 rounded-full ${lStyle.text}`}
                      style={{ background: lStyle.bg }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: lStyle.dot }} />
                  {profile?.abilityLevel}
                </span>
              )}
              {profile?.location && (
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground px-3 py-1.5 rounded-full border border-border/50 font-300"
                      style={{ background: 'oklch(0.16 0.02 248)' }}>
                  <MapPin className="h-3 w-3 shrink-0" />
                  {profile.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        {stats.length > 0 && (
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-border/60 p-4 text-center grain"
                   style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
                <Icon className="h-3.5 w-3.5 mx-auto mb-2" style={{ color: 'oklch(0.76 0.175 192)' }} />
                <p className="font-[family-name:var(--font-syne)] font-700 text-lg text-foreground leading-none">{value}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 tracking-[0.06em] uppercase font-[family-name:var(--font-syne)] font-600">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Surf conditions ── */}
        {(profile?.surfConditions.length ?? 0) > 0 && (
          <div className="rounded-2xl border border-border/60 p-5 grain"
               style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-3.5">Surf Conditions</p>
            <div className="flex flex-wrap gap-2">
              {profile!.surfConditions.map(c => (
                <span key={c} className="text-[11px] font-[family-name:var(--font-syne)] font-600 px-3 py-1.5 rounded-full"
                      style={{ background: 'oklch(0.76 0.175 192 / 0.1)', color: 'oklch(0.76 0.175 192)', border: '1px solid oklch(0.76 0.175 192 / 0.2)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Contact ── */}
        {profile?.phone && (
          <div className="rounded-2xl border border-border/60 p-5 grain"
               style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-3.5">Contact</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span className="text-sm font-300">Mobile</span>
              </div>
              <span className="text-sm font-[family-name:var(--font-syne)] font-600 text-foreground">{profile.phone}</span>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!profile?.location && !profile?.abilityLevel && (
          <div className="rounded-2xl border border-border/60 p-12 text-center grain"
               style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
            <Waves className="h-8 w-8 mx-auto mb-4" style={{ color: 'oklch(0.76 0.175 192 / 0.3)' }} />
            <p className="font-[family-name:var(--font-syne)] font-700 text-base text-foreground mb-1">Complete your profile</p>
            <p className="text-sm text-muted-foreground font-300">Finish onboarding to fill in your surf details</p>
          </div>
        )}
      </div>
    </div>
  )
}
