'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'

export default function MobileOnboarding() {
  const [mobile, setMobile] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: mobile }),
    })
    router.push('/onboarding/age')
  }

  return (
    <OnboardingShell step={2} total={7} title="Your mobile number" subtitle="We'll only use this for important session notifications">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mobile" className="text-foreground mb-1.5 block">Mobile number</Label>
          <Input id="mobile" type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+351 912 345 678" className="bg-secondary border-border" />
        </div>
        <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl">
          Continue
        </Button>
      </form>
    </OnboardingShell>
  )
}
