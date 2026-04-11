'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'

const levels = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting out, learning to stand up' },
  { value: 'intermediate', label: 'Intermediate', description: 'Catching waves consistently, working on turns' },
  { value: 'advanced', label: 'Advanced', description: 'Comfortable in most conditions, solid technique' },
  { value: 'expert', label: 'Expert', description: 'Charging big waves, competing or teaching' },
]

export default function AbilityLevelOnboarding() {
  const [selected, setSelected] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abilityLevel: selected }),
    })
    router.push('/onboarding/board-size')
  }

  return (
    <OnboardingShell step={6} total={7} title="What's your ability level?" subtitle="This helps us match you with the right surfers">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          {levels.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                selected === value
                  ? 'bg-primary/10 border-primary ring-1 ring-primary'
                  : 'bg-secondary border-border hover:border-primary/40'
              }`}
            >
              <p className={`font-semibold text-sm ${selected === value ? 'text-primary' : 'text-foreground'}`}>{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </button>
          ))}
        </div>
        <Button
          type="submit"
          disabled={!selected}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </form>
    </OnboardingShell>
  )
}
