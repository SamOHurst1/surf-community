'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function MobileOnboarding() {
  const [mobile, setMobile] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store mobile in localStorage
    localStorage.setItem('onboarding_mobile', mobile)
    router.push('/onboarding/age')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">What's your mobile number?</h1>
          <p className="text-gray-600">We'll use this for important updates</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 2 of 7</span>
            <span className="text-sm text-gray-600">Mobile</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28.6%' }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input 
              id="mobile" 
              type="tel" 
              required 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </div>
    </div>
  )
} 