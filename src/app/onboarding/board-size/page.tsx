'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function BoardSizeOnboarding() {
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const validateBoardSize = () => {
    const feetNum = parseInt(feet)
    const inchesNum = parseInt(inches)
    
    if (!feet || !inches) {
      setError('Please enter both feet and inches')
      return false
    }
    
    if (feetNum < 4 || feetNum > 10) {
      setError('Board size must be between 4ft and 10ft')
      return false
    }
    
    if (inchesNum < 0 || inchesNum > 11) {
      setError('Inches must be between 0 and 11')
      return false
    }
    
    if (feetNum === 10 && inchesNum > 0) {
      setError('Board size cannot exceed 10ft')
      return false
    }
    
    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateBoardSize()) {
      return
    }
    
    const boardSize = `${feet}'${inches.padStart(2, '0')}`
    localStorage.setItem('onboarding_boardSize', boardSize)
    localStorage.setItem('onboarding_complete', 'true')
    router.push('/')
  }

  const handleFeetChange = (value: string) => {
    const num = parseInt(value)
    if (value === '' || (num >= 4 && num <= 10)) {
      setFeet(value)
      setError('')
    }
  }

  const handleInchesChange = (value: string) => {
    const num = parseInt(value)
    if (value === '' || (num >= 0 && num <= 11)) {
      setInches(value)
      setError('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">What size board do you ride?</h1>
          <p className="text-gray-600">Last step! You're almost there</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step 7 of 7</span>
            <span className="text-sm text-gray-600">Board Size</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board Size (4ft - 10ft)
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="4"
                  max="10"
                  value={feet}
                  onChange={(e) => handleFeetChange(e.target.value)}
                  placeholder="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">ft</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={inches}
                  onChange={(e) => handleInchesChange(e.target.value)}
                  placeholder="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">in</span>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Examples: 6'02", 5'11", 9'06", 10'00"
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!feet || !inches || !!error}
          >
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  )
} 