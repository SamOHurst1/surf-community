'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import GoogleMap from "@/components/GoogleMap"

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  description: string
}

export default function LocationOnboarding() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const router = useRouter()

  const surfLocations: Location[] = [
    {
      id: 'costa-caparica',
      name: 'Costa da Caparica',
      lat: 38.6447,
      lng: -9.2354,
      description: 'Popular surf spot near Lisbon with consistent waves'
    },
    {
      id: 'tonel',
      name: 'Tonel Beach',
      lat: 37.0167,
      lng: -8.9833,
      description: 'Famous surf spot in South Portugal with powerful waves'
    },
    {
      id: 'carcavelos',
      name: 'Carcavelos',
      lat: 38.6833,
      lng: -9.3333,
      description: 'Classic beach break close to Lisbon, great for all levels'
    }
  ]

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLocation) {
      alert('Please select a location')
      return
    }
    // Store location in localStorage
    localStorage.setItem('onboarding_location', selectedLocation.name)
    localStorage.setItem('onboarding_location_lat', selectedLocation.lat.toString())
    localStorage.setItem('onboarding_location_lng', selectedLocation.lng.toString())
    router.push('/onboarding/surf-conditions')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="max-w-4xl w-full bg-card/50 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Where do you surf?</h1>
          <p className="text-muted-foreground">Select your primary surf location</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Step 4 of 7</span>
            <span className="text-sm text-muted-foreground">Location</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '57.1%' }}></div>
          </div>
        </div>

        {/* Map Container */}
        <div className="mb-6">
          <div className="relative bg-secondary/30 border-2 border-border rounded-lg p-4 h-96">
            <GoogleMap
              locations={surfLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-card px-3 py-2 rounded-lg shadow-lg z-10 border border-border">
              <div className="text-sm font-medium text-foreground mb-1">Portugal Surf Spots</div>
              <div className="text-xs text-muted-foreground">Click on a pin to select</div>
            </div>
          </div>
        </div>

        {/* Location List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-foreground">Available Locations:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {surfLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedLocation?.id === location.id
                    ? 'border-primary bg-primary/20'
                    : 'border-border hover:border-primary/50 bg-card/30'
                }`}
              >
                <div className="font-medium text-foreground">{location.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{location.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mb-6 p-4 bg-primary/20 border border-primary rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
              <div>
                <div className="font-medium text-foreground">Selected: {selectedLocation.name}</div>
                <div className="text-sm text-muted-foreground">{selectedLocation.description}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" style={{ padding: '8px 32px' }} disabled={!selectedLocation}>
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
} 