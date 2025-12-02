'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Surfer {
  id: string
  firstName: string
  lastName: string
  location: string
  abilityLevel: string
  boardSize: string
  surfConditions: string[]
  photos: string[]
  favoriteBreaks: string[]
  lastActive: string
}

export default function Home() {
  const [firstName, setFirstName] = useState('')
  const [allSurfers, setAllSurfers] = useState<Surfer[]>([])
  const [filteredSurfers, setFilteredSurfers] = useState<Surfer[]>([])
  const [selectedCategory, setSelectedCategory] = useState('nearby')

  useEffect(() => {
    setFirstName(localStorage.getItem('onboarding_firstName') || 'Surfer')
    
    // Mock surfers data - in a real app this would come from your backend
    const mockSurfers: Surfer[] = [
      {
        id: '1',
        firstName: 'João',
        lastName: 'Silva',
        location: 'Costa da Caparica',
        abilityLevel: 'Intermediate',
        boardSize: '6\'2"',
        surfConditions: ['Medium waves (3-6ft)', 'Clean conditions'],
        photos: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400'],
        favoriteBreaks: ['Costa da Caparica', 'Carcavelos'],
        lastActive: '2 hours ago'
      },
      {
        id: '2',
        firstName: 'Maria',
        lastName: 'Santos',
        location: 'Carcavelos',
        abilityLevel: 'Advanced',
        boardSize: '5\'8"',
        surfConditions: ['Large waves (6ft+)', 'All conditions'],
        photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'],
        favoriteBreaks: ['Carcavelos', 'Nazaré'],
        lastActive: '1 hour ago'
      },
      {
        id: '3',
        firstName: 'Pedro',
        lastName: 'Costa',
        location: 'Nazaré',
        abilityLevel: 'Expert',
        boardSize: '6\'0"',
        surfConditions: ['Large waves (6ft+)', 'Reef breaks'],
        photos: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
        favoriteBreaks: ['Nazaré', 'Supertubos'],
        lastActive: '30 minutes ago'
      },
      {
        id: '4',
        firstName: 'Ana',
        lastName: 'Rodrigues',
        location: 'Peniche',
        abilityLevel: 'Intermediate',
        boardSize: '5\'10"',
        surfConditions: ['Medium waves (3-6ft)', 'Point breaks'],
        photos: ['https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400'],
        favoriteBreaks: ['Supertubos', 'Baleal'],
        lastActive: '3 hours ago'
      }
    ]
    setAllSurfers(mockSurfers)
    setFilteredSurfers(mockSurfers) // Initially show all surfers
  }, [])

  const filterSurfers = (category: string) => {
    let filtered: Surfer[] = []
    
    switch (category) {
      case 'nearby':
        // Show surfers from nearby locations (Costa da Caparica, Carcavelos)
        filtered = allSurfers.filter(surfer => 
          surfer.location === 'Costa da Caparica' || surfer.location === 'Carcavelos'
        )
        break
      case 'same-break':
        // Show surfers who surf at the same breaks (Costa da Caparica, Carcavelos)
        filtered = allSurfers.filter(surfer => 
          surfer.favoriteBreaks.some(break_ => 
            break_ === 'Costa da Caparica' || break_ === 'Carcavelos'
          )
        )
        break
      case 'similar-level':
        // Show surfers with similar ability levels (Intermediate, Advanced)
        const userLevel = localStorage.getItem('onboarding_abilityLevel') || 'Intermediate'
        filtered = allSurfers.filter(surfer => 
          surfer.abilityLevel === userLevel || 
          (userLevel === 'Intermediate' && surfer.abilityLevel === 'Advanced') ||
          (userLevel === 'Advanced' && surfer.abilityLevel === 'Intermediate')
        )
        break
      default:
        filtered = allSurfers
    }
    
    setFilteredSurfers(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterSurfers(category)
  }

  const startConversation = (surfer: Surfer) => {
    // Create a new conversation in localStorage
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
    const newConversation = {
      id: Date.now().toString(),
      surferId: surfer.id,
      surferName: `${surfer.firstName} ${surfer.lastName}`,
      surferPhoto: surfer.photos[0] || '',
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unread: false
    }
    
    // Check if conversation already exists
    const existingConversation = conversations.find((conv: any) => conv.surferId === surfer.id)
    if (!existingConversation) {
      conversations.push(newConversation)
      localStorage.setItem('conversations', JSON.stringify(conversations))
    }
    
    // Redirect to messages page
    window.location.href = '/messages'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12" style={{ margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Surf Discovery 🏄‍♂️
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12">
              Hey {firstName}! Discover surfers near you and connect for epic sessions!
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button
              onClick={() => handleCategoryChange('nearby')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 my-2 ${
                selectedCategory === 'nearby'
                  ? 'text-black shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              style={selectedCategory === 'nearby' ? { backgroundColor: '#14b8a6', padding: '8px 32px' } : {}}
            >
              🏠 Nearby Surfers
            </button>
            <button
              onClick={() => handleCategoryChange('same-break')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 my-2 ${
                selectedCategory === 'same-break'
                  ? 'text-black shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              style={selectedCategory === 'same-break' ? { backgroundColor: '#14b8a6', padding: '8px 32px' } : {}}
            >
              🌊 Same Break
            </button>
            <button
              onClick={() => handleCategoryChange('similar-level')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 my-2 ${
                selectedCategory === 'similar-level'
                  ? 'text-black shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              style={selectedCategory === 'similar-level' ? { backgroundColor: '#14b8a6', padding: '8px 32px' } : {}}
            >
              🎯 Similar Level
            </button>
          </div>
          
          {/* Spacer */}
          <div className="h-6"></div>
          
          {/* Surfers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurfers.map((surfer: Surfer) => (
              <div
                key={surfer.id}
                className="bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm rounded-2xl border border-border/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer my-4"
                onClick={() => startConversation(surfer)}
              >
                {/* Surfer Photo */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/40">
                  {surfer.photos.length > 0 ? (
                    <img
                      src={surfer.photos[0]}
                      alt={`${surfer.firstName} ${surfer.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl">🏄‍♂️</div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {surfer.lastActive}
                  </div>
                </div>
                
                {/* Surfer Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {surfer.firstName} {surfer.lastName}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {surfer.location}
                    </div>
                  </div>
                  
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground w-20 font-medium">Level:</span>
                      <span className="text-foreground font-semibold">{surfer.abilityLevel}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground w-20 font-medium">Board:</span>
                      <span className="text-foreground font-semibold">{surfer.boardSize}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground w-20 font-medium">Breaks:</span>
                      <span className="text-foreground font-semibold">{surfer.favoriteBreaks.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  
                  {/* Surf Conditions */}
                  <div className="mb-10">
                    <div className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Surf Conditions</div>
                    <div className="flex flex-wrap gap-2">
                      {surfer.surfConditions.slice(0, 2).map((condition, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Message Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startConversation(surfer)
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 mt-4"
                  >
                    💬 Start Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
