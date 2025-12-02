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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedConditions.length === 0) {
      alert('Please select at least one surf condition')
      return
    }
    // Store surf conditions in localStorage
    localStorage.setItem('onboarding_surfConditions', JSON.stringify(selectedConditions))
    router.push('/onboarding/ability-level')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">What conditions do you surf?</h1>
          <p className="text-gray-600">Select all that apply</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 5 of 7</span>
            <span className="text-sm text-gray-600">Surf Conditions</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '71.4%' }}></div>
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
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
} 