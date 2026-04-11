'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function SurfConditionsOnboarding() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const router = useRouter()

  const surfConditions = [
    'Small waves (1-3ft)',
    'Medium waves (3-6ft)',
    'Large waves (6ft+)',
    'Beach breaks',
    'Point breaks',
    'Reef breaks',
    'Clean conditions',
    'Choppy conditions',
    'All conditions'
  ]

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedConditions.length === 0) {
      alert('Please select at least one surf condition')
      return
    }
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surfConditions: selectedConditions }),
    })
    router.push('/onboarding/ability-level')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">What conditions do you surf?</h1>
          <p className="text-muted-foreground">Select all that apply</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step 5 of 7</span>
            <span className="text-sm text-muted-foreground">Surf Conditions</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '71.4%' }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {surfConditions.map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => handleConditionToggle(condition)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  selectedConditions.includes(condition)
                    ? 'bg-primary/20 border-primary text-foreground'
                    : 'bg-card/30 border-border hover:border-primary/50 text-foreground'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" style={{ padding: '8px 32px' }}>Continue</Button>
        </form>
      </div>
    </div>
  )
} 