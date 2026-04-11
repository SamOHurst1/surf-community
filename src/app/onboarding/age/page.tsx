'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'

export default function AgeOnboarding() {
  const [age, setAge] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: parseInt(age) }),
    })
    router.push('/onboarding/location')
  }

  return (
    <OnboardingShell step={3} total={7} title="How old are you?" subtitle="Helps us match you with surfers of a similar age">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="age" className="text-foreground mb-1.5 block">Age</Label>
          <Input id="age" type="number" min="13" max="120" required value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" className="bg-secondary border-border" />
        </div>
        <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl">
          Continue
        </Button>
      </form>
    </OnboardingShell>
  )
}
