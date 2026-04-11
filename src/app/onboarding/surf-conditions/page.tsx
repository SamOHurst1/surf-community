'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'

const conditions = [
  'Small waves (1-3ft)',
  'Medium waves (3-6ft)',
  'Large waves (6ft+)',
  'Beach breaks',
  'Point breaks',
  'Reef breaks',
  'Clean conditions',
  'Choppy conditions',
  'All conditions',
]

export default function SurfConditionsOnboarding() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()

  const toggle = (c: string) =>
    setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selected.length === 0) return
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surfConditions: selected }),
    })
    router.push('/onboarding/ability-level')
  }

  return (
    <OnboardingShell step={5} total={7} title="What conditions do you surf?" subtitle="Select all that apply — be honest!">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-wrap gap-2.5">
          {conditions.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => toggle(c)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                selected.includes(c)
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'bg-secondary text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <Button
          type="submit"
          disabled={selected.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </form>
    </OnboardingShell>
  )
}
