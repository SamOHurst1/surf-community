'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Waves, MapPin, Ruler, Phone, Calendar, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ProfilePhoto {
  id: string
  url: string
  isPrimary: boolean
  order: number
}

interface SurferProfile {
  id: string
  name: string
  image: string | null
  photos: ProfilePhoto[]
  phone: string | null
  age: number | null
  abilityLevel: string | null
  boardFeet: number | null
  boardInches: number | null
  location: string | null
  surfConditions: string[]
  surfStatus: string | null
  joinedAt: string
}

const levelStyle: Record<string, { dot: string; text: string; bg: string }> = {
  beginner:     { dot: '#34d399', text: 'text-emerald-400', bg: 'oklch(0.76 0.175 165 / 0.12)' },
  intermediate: { dot: '#38bdf8', text: 'text-sky-400',     bg: 'oklch(0.76 0.175 215 / 0.12)' },
  advanced:     { dot: '#a78bfa', text: 'text-violet-400',  bg: 'oklch(0.76 0.175 285 / 0.12)' },
  expert:       { dot: '#fbbf24', text: 'text-amber-400',   bg: 'oklch(0.76 0.175 80  / 0.12)' },
}

export default function SurferProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [surfer, setSurfer] = useState<SurferProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    fetch(`/api/surfers/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setSurfer(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (notFound || !surfer) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <Waves className="h-10 w-10 mb-4" style={{ color: 'oklch(0.76 0.175 192 / 0.3)' }} />
        <p className="font-[family-name:var(--font-syne)] font-700 text-lg text-foreground mb-1">Surfer not found</p>
        <p className="text-sm text-muted-foreground mb-6">They may have left the lineup</p>
        <button onClick={() => router.back()} className="text-sm text-primary hover:underline">Go back</button>
      </div>
    )
  }

  const initials   = surfer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const level      = levelStyle[(surfer.abilityLevel ?? '').toLowerCase()]
  const photos     = surfer.photos ?? []
  const hasMulti   = photos.length > 1
  const displayImg = photos.length > 0 ? photos[photoIdx]?.url : surfer.image
  const boardSize = surfer.boardFeet
    ? `${surfer.boardFeet}'${String(surfer.boardInches ?? 0).padStart(2, '0')}"`
    : null

  const stats = [
    boardSize       ? { icon: Ruler,    label: 'Board',      value: boardSize }             : null,
    surfer.age      ? { icon: Calendar, label: 'Age',        value: String(surfer.age) }    : null,
    surfer.surfConditions.length > 0 ? { icon: Waves, label: 'Conditions', value: String(surfer.surfConditions.length) } : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 py-8 lg:py-10 space-y-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* ── Hero card ── */}
        <div className="relative rounded-2xl overflow-hidden border border-border/60 grain"
             style={{ background: 'linear-gradient(160deg, oklch(0.14 0.025 248) 0%, oklch(0.10 0.02 252) 100%)' }}>

          <div className="h-28 relative overflow-hidden">
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(135deg, oklch(0.76 0.175 192 / 0.25) 0%, oklch(0.76 0.175 230 / 0.1) 50%, oklch(0.13 0.022 248 / 0) 100%)' }} />
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 112" fill="none" preserveAspectRatio="none">
              <path d="M0 60 Q100 20 200 60 T400 60" stroke="oklch(0.76 0.175 192)" strokeWidth="1" fill="none" />
              <path d="M0 80 Q100 40 200 80 T400 80" stroke="oklch(0.76 0.175 192)" strokeWidth="0.5" fill="none" />
            </svg>
          </div>

          <div className="px-5 sm:px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-5">
              {/* Avatar / photo with carousel */}
              <div className="relative">
                {displayImg ? (
                  <div className="relative h-[88px] w-[88px] rounded-full overflow-hidden shadow-xl"
                       style={{ boxShadow: '0 0 0 3px oklch(0.13 0.022 248), 0 0 0 5px oklch(0.76 0.175 192 / 0.25)' }}>
                    <img key={displayImg} src={displayImg} alt={surfer.name} className="w-full h-full object-cover" />
                    {hasMulti && (
                      <>
                        {photoIdx > 0 && (
                          <button onClick={() => setPhotoIdx(i => i - 1)}
                                  className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-start pl-1"
                                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)' }}>
                            <ChevronLeft className="h-3 w-3 text-white" />
                          </button>
                        )}
                        {photoIdx < photos.length - 1 && (
                          <button onClick={() => setPhotoIdx(i => i + 1)}
                                  className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end pr-1"
                                  style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)' }}>
                            <ChevronRight className="h-3 w-3 text-white" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <Avatar className="h-[88px] w-[88px] shadow-xl" style={{ boxShadow: '0 0 0 3px oklch(0.13 0.022 248), 0 0 0 5px oklch(0.76 0.175 192 / 0.25)' }}>
                    <AvatarFallback className="text-2xl font-[family-name:var(--font-syne)] font-800"
                                    style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                {/* Dot indicators below avatar */}
                {hasMulti && (
                  <div className="flex justify-center gap-1 mt-1.5">
                    {photos.map((_, di) => (
                      <button key={di} onClick={() => setPhotoIdx(di)}
                              className="w-1.5 h-1.5 rounded-full transition-colors"
                              style={{ background: di === photoIdx ? 'oklch(0.76 0.175 192)' : 'oklch(0.76 0.175 192 / 0.3)' }} />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push(`/messages?userId=${surfer.id}`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-[family-name:var(--font-syne)] font-600 transition-all duration-150"
                style={{ background: 'oklch(0.76 0.175 192)', color: 'oklch(0.07 0.025 248)' }}
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </button>
            </div>

            <h1 className="font-[family-name:var(--font-syne)] font-700 text-2xl tracking-tight text-foreground leading-tight">{surfer.name}</h1>

            <div className="flex flex-wrap gap-2 mt-4">
              {level && (
                <span className={`flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase px-3 py-1.5 rounded-full ${level.text}`}
                      style={{ background: level.bg }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: level.dot }} />
                  {surfer.abilityLevel}
                </span>
              )}
              {surfer.location && (
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground px-3 py-1.5 rounded-full border border-border/50 font-300"
                      style={{ background: 'oklch(0.16 0.02 248)' }}>
                  <MapPin className="h-3 w-3 shrink-0" />
                  {surfer.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Status ── */}
        {surfer.surfStatus && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border"
               style={{ background: 'oklch(0.76 0.175 192 / 0.07)', borderColor: 'oklch(0.76 0.175 192 / 0.2)' }}>
            <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: 'oklch(0.76 0.175 192)' }} />
            <span className="text-sm font-[family-name:var(--font-syne)] font-600" style={{ color: 'oklch(0.76 0.175 192)' }}>
              {surfer.surfStatus}
            </span>
          </div>
        )}

        {/* ── Stats ── */}
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
        {surfer.surfConditions.length > 0 && (
          <div className="rounded-2xl border border-border/60 p-5 grain"
               style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-3.5">Surf Conditions</p>
            <div className="flex flex-wrap gap-2">
              {surfer.surfConditions.map(c => (
                <span key={c} className="text-[11px] font-[family-name:var(--font-syne)] font-600 px-3 py-1.5 rounded-full"
                      style={{ background: 'oklch(0.76 0.175 192 / 0.1)', color: 'oklch(0.76 0.175 192)', border: '1px solid oklch(0.76 0.175 192 / 0.2)' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Contact ── */}
        {surfer.phone && (
          <div className="rounded-2xl border border-border/60 p-5 grain"
               style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-3.5">Contact</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span className="text-sm font-300">Mobile</span>
              </div>
              <a href={`tel:${surfer.phone}`} className="text-sm font-[family-name:var(--font-syne)] font-600 text-primary hover:underline">
                {surfer.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
