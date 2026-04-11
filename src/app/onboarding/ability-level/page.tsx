'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function AbilityLevelOnboarding() {
  const [selectedLevel, setSelectedLevel] = useState('')
  const router = useRouter()

  const abilityLevels = [
    {
      level: 'Beginner',
      description: 'Just starting out, learning the basics'
    },
    {
      level: 'Intermediate',
      description: 'Can catch waves consistently, working on technique'
    },
    {
      level: 'Advanced',
      description: 'Experienced surfer, comfortable in various conditions'
    },
    {
      level: 'Expert',
      description: 'Highly skilled, can surf challenging waves'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLevel) {
      alert('Please select your ability level')
      return
    }
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ abilityLevel: selectedLevel.toLowerCase() }),
    })
    router.push('/onboarding/board-size')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">What's your ability level?</h1>
          <p className="text-muted-foreground">This helps us match you with similar surfers</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step 6 of 7</span>
            <span className="text-sm text-muted-foreground">Ability Level</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '85.7%' }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {abilityLevels.map(({ level, description }) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedLevel === level
                    ? 'bg-primary/20 border-primary text-foreground'
                    : 'bg-card/30 border-border hover:border-primary/50 text-foreground'
                }`}
              >
                <div className="font-medium">{level}</div>
                <div className="text-sm text-muted-foreground mt-1">{description}</div>
              </button>
            ))}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" style={{ padding: '8px 32px' }}>Continue</Button>
        </form>
      </div>
    </div>
  )
} 