'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AgeOnboarding() {
  const [age, setAge] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store age in localStorage
    localStorage.setItem('onboarding_age', age)
    router.push('/onboarding/location')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">How old are you?</h1>
          <p className="text-gray-600">This helps us match you with similar surfers</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 3 of 7</span>
            <span className="text-sm text-gray-600">Age</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42.9%' }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              type="number" 
              min="13"
              max="120"
              required 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
}
