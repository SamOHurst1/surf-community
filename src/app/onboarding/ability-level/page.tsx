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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLevel) {
      alert('Please select your ability level')
      return
    }
    // Store ability level in localStorage
    localStorage.setItem('onboarding_abilityLevel', selectedLevel)
    router.push('/onboarding/board-size')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">What's your ability level?</h1>
          <p className="text-gray-600">This helps us match you with similar surfers</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 6 of 7</span>
            <span className="text-sm text-gray-600">Ability Level</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85.7%' }}></div>
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
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{level}</div>
                <div className="text-sm text-gray-600 mt-1">{description}</div>
              </button>
            ))}
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
} 