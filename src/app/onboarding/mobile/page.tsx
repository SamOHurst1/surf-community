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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">What's your mobile number?</h1>
          <p className="text-muted-foreground">We'll use this for important updates</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step 2 of 7</span>
            <span className="text-sm text-muted-foreground">Mobile</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '28.6%' }}></div>
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
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" style={{ padding: '8px 32px' }}>Continue</Button>
        </form>
      </div>
    </div>
  )
} 