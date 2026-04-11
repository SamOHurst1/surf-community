'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'

export default function NameOnboarding() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `${firstName} ${lastName}`.trim() }),
    })
    router.push('/onboarding/mobile')
  }

  return (
    <OnboardingShell step={1} total={7} title="What's your name?" subtitle="Help other surfers find and recognise you">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName" className="text-foreground mb-1.5 block">First name</Label>
          <Input id="firstName" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. João" className="bg-secondary border-border" />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-foreground mb-1.5 block">Last name</Label>
          <Input id="lastName" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Silva" className="bg-secondary border-border" />
        </div>
        <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl">
          Continue
        </Button>
      </form>
    </OnboardingShell>
  )
}
