'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the first onboarding step
    router.push('/onboarding/name')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🏄</div>
        <p className="text-foreground">Loading onboarding...</p>
      </div>
    </div>
  )
}

