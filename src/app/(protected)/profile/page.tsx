'use client'

import { useEffect, useRef, useState } from 'react'
import { Waves, MapPin, Ruler, Phone, Calendar, PenLine, Check, X, ChevronDown } from 'lucide-react'
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
  phoneVisible: boolean
  surfStatus: string | null
}

const levelStyle: Record<string, { dot: string; text: string; bg: string }> = {
  beginner:     { dot: '#34d399', text: 'text-emerald-400', bg: 'oklch(0.76 0.175 165 / 0.12)' },
  intermediate: { dot: '#38bdf8', text: 'text-sky-400',     bg: 'oklch(0.76 0.175 215 / 0.12)' },
  advanced:     { dot: '#a78bfa', text: 'text-violet-400',  bg: 'oklch(0.76 0.175 285 / 0.12)' },
  expert:       { dot: '#fbbf24', text: 'text-amber-400',   bg: 'oklch(0.76 0.175 80  / 0.12)' },
}

const abilityLevels = [
  { value: 'beginner',     label: 'Beginner',     desc: 'Learning to stand up' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Catching waves consistently' },
  { value: 'advanced',     label: 'Advanced',     desc: 'Solid technique, most conditions' },
  { value: 'expert',       label: 'Expert',       desc: 'Big waves, competing or coaching' },
]

const allConditions = [
  'Small waves (1-3ft)',
  'Medium waves (3-6ft)',
  'Big waves (6ft+)',
  'Beach breaks',
  'Point breaks',
  'Reef breaks',
  'Clean conditions',
  'Choppy conditions',
  'All conditions',
]

const statusPresets = [
  'Surfing now',
  'Going out later today',
  'Watching the swell',
  'Looking for a session partner',
  'Resting — next swell only',
]

const feetOptions  = Array.from({ length: 7 }, (_, i) => i + 4)   // 4–10 ft
const inchOptions  = Array.from({ length: 12 }, (_, i) => i)       // 0–11 in

export default function ProfilePage() {
  const [profile, setProfile]         = useState<UserProfile | null>(null)
  const [loading, setLoading]         = useState(true)

  // Phone edit
  const [editingPhone, setEditingPhone] = useState(false)
  const [phoneValue, setPhoneValue]     = useState('')
  const [savingPhone, setSavingPhone]   = useState(false)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  // Surf stats edit
  const [editingStats, setEditingStats]             = useState(false)
  const [draftLevel, setDraftLevel]                 = useState('')
  const [draftFeet, setDraftFeet]                   = useState<number | ''>('')
  const [draftInches, setDraftInches]               = useState<number>(0)
  const [draftConditions, setDraftConditions]       = useState<string[]>([])
  const [draftLocation, setDraftLocation]           = useState('')
  const [savingStats, setSavingStats]               = useState(false)

  // Surf status
  const [savingStatus, setSavingStatus]     = useState(false)
  const [customStatus, setCustomStatus]     = useState('')
  const [editingCustom, setEditingCustom]   = useState(false)
  const customInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setPhoneValue(data.phone ?? '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  /* ── Phone ── */
  const startEditPhone = () => {
    setEditingPhone(true)
    setTimeout(() => phoneInputRef.current?.focus(), 30)
  }
  const cancelEditPhone = () => { setEditingPhone(false); setPhoneValue(profile?.phone ?? '') }
  const savePhone = async () => {
    setSavingPhone(true)
    await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneValue }),
    })
    setProfile(p => p ? { ...p, phone: phoneValue || null } : p)
    setEditingPhone(false)
    setSavingPhone(false)
  }
  const togglePhoneVisible = async () => {
    const next = !(profile?.phoneVisible ?? true)
    setProfile(p => p ? { ...p, phoneVisible: next } : p)
    await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneVisible: next }),
    })
  }

  /* ── Surf stats ── */
  const startEditStats = () => {
    setDraftLevel(profile?.abilityLevel ?? '')
    setDraftFeet(profile?.boardFeet ?? '')
    setDraftInches(profile?.boardInches ?? 0)
    setDraftConditions(profile?.surfConditions ?? [])
    setDraftLocation(profile?.location ?? '')
    setEditingStats(true)
  }
  const cancelEditStats = () => setEditingStats(false)
  const toggleCondition = (c: string) =>
    setDraftConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const saveStats = async () => {
    setSavingStats(true)
    await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        abilityLevel:   draftLevel   || null,
        boardFeet:      draftFeet    !== '' ? Number(draftFeet)   : null,
        boardInches:    draftFeet    !== '' ? Number(draftInches) : null,
        surfConditions: draftConditions,
        location:       draftLocation || null,
      }),
    })
    setProfile(p => p ? {
      ...p,
      abilityLevel:   draftLevel || null,
      boardFeet:      draftFeet !== '' ? Number(draftFeet)   : null,
      boardInches:    draftFeet !== '' ? Number(draftInches) : null,
      surfConditions: draftConditions,
      location:       draftLocation || null,
    } : p)
    setEditingStats(false)
    setSavingStats(false)
  }

  /* ── Surf status ── */
  const setStatus = async (status: string | null) => {
    setSavingStatus(true)
    setProfile(p => p ? { ...p, surfStatus: status } : p)
    await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surfStatus: status }),
    })
    setSavingStatus(false)
  }

  const saveCustomStatus = async () => {
    const trimmed = customStatus.trim()
    if (!trimmed) return
    setEditingCustom(false)
    setCustomStatus('')
    await setStatus(trimmed)
  }

  const startCustomStatus = () => {
    setEditingCustom(true)
    setTimeout(() => customInputRef.current?.focus(), 30)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  const name      = profile?.name ?? 'Surfer'
  const image     = profile?.image ?? undefined
  const initials  = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const level     = (profile?.abilityLevel ?? '').toLowerCase()
  const lStyle    = levelStyle[level]
  const boardSize = profile?.boardFeet
    ? `${profile.boardFeet}'${String(profile.boardInches ?? 0).padStart(2, '0')}"`
    : null

  const stats = [
    boardSize              ? { icon: Ruler,    label: 'Board',      value: boardSize }                                              : null,
    profile?.age           ? { icon: Calendar, label: 'Age',        value: String(profile.age) }                                   : null,
    (profile?.surfConditions.length ?? 0) > 0
                           ? { icon: Waves,    label: 'Conditions', value: String(profile!.surfConditions.length) }                : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-10 py-8 lg:py-10 space-y-4">

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
              <Avatar className="h-[88px] w-[88px] shadow-xl" style={{ boxShadow: '0 0 0 3px oklch(0.13 0.022 248), 0 0 0 5px oklch(0.76 0.175 192 / 0.25)' }}>
                <AvatarImage src={image} />
                <AvatarFallback className="text-2xl font-[family-name:var(--font-syne)] font-800"
                                style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="font-[family-name:var(--font-syne)] font-700 text-2xl tracking-tight text-foreground leading-tight">{name}</h1>
            {profile?.email && (
              <p className="text-[13px] text-muted-foreground mt-0.5 font-300">{profile.email}</p>
            )}

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

        {/* ── Status ── */}
        <div className="rounded-2xl border border-border/60 p-5 grain"
             style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
          <div className="flex items-center justify-between mb-3.5">
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
              Status
            </p>
            {profile?.surfStatus && (
              <button
                onClick={() => setStatus(null)}
                disabled={savingStatus}
                className="text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.06em] uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              >
                Clear
              </button>
            )}
          </div>

          {profile?.surfStatus && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl border"
                 style={{ background: 'oklch(0.76 0.175 192 / 0.08)', borderColor: 'oklch(0.76 0.175 192 / 0.25)' }}>
              <span className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ background: 'oklch(0.76 0.175 192)' }} />
              <span className="text-sm font-[family-name:var(--font-syne)] font-600" style={{ color: 'oklch(0.76 0.175 192)' }}>
                {profile.surfStatus}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {statusPresets.map(preset => (
              <button
                key={preset}
                onClick={() => setStatus(preset === profile?.surfStatus ? null : preset)}
                disabled={savingStatus}
                className="text-[11px] font-[family-name:var(--font-syne)] font-600 px-3 py-1.5 rounded-full border transition-all duration-150 disabled:opacity-40"
                style={preset === profile?.surfStatus ? {
                  background: 'oklch(0.76 0.175 192)',
                  color: 'oklch(0.07 0.025 248)',
                  borderColor: 'oklch(0.76 0.175 192)',
                } : {
                  background: 'oklch(0.16 0.02 248)',
                  color: 'oklch(0.55 0.02 240)',
                  borderColor: 'oklch(0.22 0.02 245)',
                }}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Custom status input */}
          {editingCustom ? (
            <div className="flex items-center gap-2">
              <input
                ref={customInputRef}
                type="text"
                value={customStatus}
                onChange={e => setCustomStatus(e.target.value.slice(0, 80))}
                onKeyDown={e => { if (e.key === 'Enter') saveCustomStatus(); if (e.key === 'Escape') { setEditingCustom(false); setCustomStatus('') } }}
                placeholder="Write a custom status…"
                maxLength={80}
                className="flex-1 text-sm text-foreground bg-transparent border-b focus:outline-none placeholder:text-muted-foreground/40"
                style={{ borderColor: 'oklch(0.76 0.175 192 / 0.4)' }}
              />
              <button
                onClick={saveCustomStatus}
                disabled={!customStatus.trim() || savingStatus}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => { setEditingCustom(false); setCustomStatus('') }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                style={{ background: 'oklch(0.18 0.022 248)' }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={startCustomStatus}
              disabled={savingStatus}
              className="text-[11px] font-[family-name:var(--font-syne)] font-600 px-3 py-1.5 rounded-full border transition-all duration-150 disabled:opacity-40"
              style={{ background: 'oklch(0.16 0.02 248)', color: 'oklch(0.55 0.02 240)', borderColor: 'oklch(0.22 0.02 245)' }}
            >
              + Custom
            </button>
          )}
        </div>

        {/* ── Surf details (editable) ── */}
        <div className="rounded-2xl border border-border/60 grain overflow-hidden"
             style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">Surf Details</p>
            {!editingStats ? (
              <button
                onClick={startEditStats}
                className="flex items-center gap-1 text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <PenLine className="h-3 w-3" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={saveStats}
                  disabled={savingStats}
                  className="flex items-center gap-1 text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase transition-colors disabled:opacity-40"
                  style={{ color: 'oklch(0.76 0.175 192)' }}
                >
                  <Check className="h-3 w-3" />
                  Save
                </button>
                <button
                  onClick={cancelEditStats}
                  className="flex items-center gap-1 text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!editingStats ? (
            /* View mode */
            <div className="px-5 py-4 space-y-4">
              {/* Ability level */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-300">Ability level</span>
                {lStyle ? (
                  <span className={`flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase px-2.5 py-1 rounded-full ${lStyle.text}`}
                        style={{ background: lStyle.bg }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: lStyle.dot }} />
                    {profile?.abilityLevel}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground font-300">Not set</span>
                )}
              </div>
              {/* Board size */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-300">Board size</span>
                <span className="text-sm font-[family-name:var(--font-syne)] font-600 text-foreground">
                  {boardSize ?? <span className="text-muted-foreground font-300">Not set</span>}
                </span>
              </div>
              {/* Location */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-300">Home break</span>
                <span className="text-sm font-[family-name:var(--font-syne)] font-600 text-foreground">
                  {profile?.location ?? <span className="text-muted-foreground font-300">Not set</span>}
                </span>
              </div>
              {/* Conditions */}
              {(profile?.surfConditions.length ?? 0) > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground font-300 block mb-2">Surf conditions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile!.surfConditions.map(c => (
                      <span key={c} className="text-[10px] font-[family-name:var(--font-syne)] font-600 px-2.5 py-1 rounded-full"
                            style={{ background: 'oklch(0.76 0.175 192 / 0.1)', color: 'oklch(0.76 0.175 192)', border: '1px solid oklch(0.76 0.175 192 / 0.2)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Edit mode */
            <div className="px-5 py-5 space-y-6">
              {/* Ability level */}
              <div>
                <p className="text-xs text-muted-foreground font-300 mb-3">Ability level</p>
                <div className="grid grid-cols-2 gap-2">
                  {abilityLevels.map(({ value, label, desc }) => {
                    const ls = levelStyle[value]
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDraftLevel(value)}
                        className="text-left p-3 rounded-xl border transition-all duration-150"
                        style={draftLevel === value ? {
                          background: ls.bg,
                          borderColor: ls.dot + '60',
                        } : {
                          background: 'oklch(0.16 0.02 248)',
                          borderColor: 'oklch(0.22 0.02 245)',
                        }}
                      >
                        <p className={`text-xs font-[family-name:var(--font-syne)] font-600 ${draftLevel === value ? levelStyle[value].text : 'text-foreground'}`}>{label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-300">{desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Board size */}
              <div>
                <p className="text-xs text-muted-foreground font-300 mb-3">Board size</p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <select
                      value={draftFeet}
                      onChange={e => setDraftFeet(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full appearance-none text-sm font-[family-name:var(--font-syne)] font-600 text-foreground px-3 py-2.5 pr-8 rounded-xl border focus:outline-none transition-colors"
                      style={{ background: 'oklch(0.16 0.02 248)', borderColor: 'oklch(0.22 0.02 245)' }}
                    >
                      <option value="">— ft</option>
                      {feetOptions.map(f => <option key={f} value={f}>{f}&apos;</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={draftInches}
                      onChange={e => setDraftInches(Number(e.target.value))}
                      disabled={draftFeet === ''}
                      className="w-full appearance-none text-sm font-[family-name:var(--font-syne)] font-600 text-foreground px-3 py-2.5 pr-8 rounded-xl border focus:outline-none transition-colors disabled:opacity-40"
                      style={{ background: 'oklch(0.16 0.02 248)', borderColor: 'oklch(0.22 0.02 245)' }}
                    >
                      {inchOptions.map(i => <option key={i} value={i}>{i}&quot;</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Home break */}
              <div>
                <p className="text-xs text-muted-foreground font-300 mb-3">Home break</p>
                <input
                  type="text"
                  value={draftLocation}
                  onChange={e => setDraftLocation(e.target.value)}
                  placeholder="e.g. Supertubes, J-Bay"
                  className="w-full text-sm text-foreground px-3 py-2.5 rounded-xl border focus:outline-none placeholder:text-muted-foreground/40 bg-transparent transition-colors"
                  style={{ borderColor: 'oklch(0.22 0.02 245)' }}
                />
              </div>

              {/* Surf conditions */}
              <div>
                <p className="text-xs text-muted-foreground font-300 mb-3">Surf conditions</p>
                <div className="flex flex-wrap gap-2">
                  {allConditions.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCondition(c)}
                      className="text-[11px] font-[family-name:var(--font-syne)] font-600 px-3 py-1.5 rounded-full border transition-all duration-150"
                      style={draftConditions.includes(c) ? {
                        background: 'oklch(0.76 0.175 192)',
                        color: 'oklch(0.07 0.025 248)',
                        borderColor: 'oklch(0.76 0.175 192)',
                      } : {
                        background: 'oklch(0.16 0.02 248)',
                        color: 'oklch(0.55 0.02 240)',
                        borderColor: 'oklch(0.22 0.02 245)',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Contact ── */}
        <div className="rounded-2xl border border-border/60 p-5 grain"
             style={{ background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)' }}>
          <div className="flex items-center justify-between mb-3.5">
            <p className="font-[family-name:var(--font-syne)] font-600 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">Contact</p>
            {!editingPhone && (
              <button
                onClick={startEditPhone}
                className="flex items-center gap-1 text-[10px] font-[family-name:var(--font-syne)] font-600 tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <PenLine className="h-3 w-3" />
                {profile?.phone ? 'Edit' : 'Add'}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-muted-foreground shrink-0">
              <Phone className="h-3.5 w-3.5" />
              <span className="text-sm font-300">Mobile</span>
            </div>

            {editingPhone ? (
              <div className="flex items-center gap-2 flex-1 justify-end">
                <input
                  ref={phoneInputRef}
                  type="tel"
                  value={phoneValue}
                  onChange={e => setPhoneValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') savePhone(); if (e.key === 'Escape') cancelEditPhone() }}
                  placeholder="+351 912 345 678"
                  className="flex-1 min-w-0 text-sm text-right text-foreground bg-transparent border-b focus:outline-none placeholder:text-muted-foreground/40"
                  style={{ borderColor: 'oklch(0.76 0.175 192 / 0.4)' }}
                />
                <button
                  onClick={savePhone}
                  disabled={savingPhone}
                  className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                  style={{ background: 'oklch(0.76 0.175 192 / 0.15)', color: 'oklch(0.76 0.175 192)' }}
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={cancelEditPhone}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  style={{ background: 'oklch(0.18 0.022 248)' }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <span
                className="text-sm font-[family-name:var(--font-syne)] font-600 text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={startEditPhone}
              >
                {profile?.phone || <span className="text-muted-foreground font-300 font-[family-name:var(--font-dm-sans)]">Not set — tap to add</span>}
              </span>
            )}
          </div>

          {profile?.phone && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
              <span className="text-xs text-muted-foreground font-300">Visible to other surfers</span>
              <button
                onClick={togglePhoneVisible}
                className="relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0"
                style={{
                  background: profile.phoneVisible
                    ? 'oklch(0.76 0.175 192)'
                    : 'oklch(0.22 0.022 248)',
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: profile.phoneVisible ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
