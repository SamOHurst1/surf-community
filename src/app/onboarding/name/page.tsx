'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function NameOnboarding() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store name in localStorage
    localStorage.setItem('onboarding_firstName', firstName)
    localStorage.setItem('onboarding_lastName', lastName)
    router.push('/onboarding/mobile')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">What's your name?</h1>
          <p className="text-gray-600">Help us personalize your experience</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 1 of 7</span>
            <span className="text-sm text-gray-600">Name</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '14.3%' }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              type="text" 
              required 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              type="text" 
              required 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
}