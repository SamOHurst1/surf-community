'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'

export default function BoardSizeOnboarding() {
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const validate = () => {
    const f = parseInt(feet), i = parseInt(inches)
    if (!feet || !inches) { setError('Enter both feet and inches'); return false }
    if (f < 4 || f > 10) { setError('Board must be between 4ft and 10ft'); return false }
    if (i < 0 || i > 11) { setError('Inches must be 0–11'); return false }
    if (f === 10 && i > 0) { setError('Board cannot exceed 10ft 0"'); return false }
    setError(''); return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardFeet: parseInt(feet), boardInches: parseInt(inches), onboardingComplete: true }),
    })
    router.push('/')
  }

  return (
    <OnboardingShell step={7} total={7} title="What size board do you ride?" subtitle="Last step! Then you're ready to paddle out.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground mb-3">Board size (4ft – 10ft)</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number" min="4" max="10" value={feet} placeholder="6"
                  onChange={e => { setFeet(e.target.value); setError('') }}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-1">feet</p>
            </div>
            <span className="text-2xl font-bold text-muted-foreground pb-5">&apos;</span>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number" min="0" max="11" value={inches} placeholder="2"
                  onChange={e => { setInches(e.target.value); setError('') }}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-1">inches</p>
            </div>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          <p className="text-xs text-muted-foreground mt-2">e.g. 6&apos;2&quot;, 5&apos;10&quot;, 9&apos;6&quot;</p>
        </div>

        <Button
          type="submit"
          disabled={!feet || !inches}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl disabled:opacity-40"
        >
          Complete Setup
        </Button>
      </form>
    </OnboardingShell>
  )
}
