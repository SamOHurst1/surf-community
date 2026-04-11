'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import OnboardingShell from '@/components/OnboardingShell'
import GoogleMap from '@/components/GoogleMap'

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  description: string
}

const surfLocations: Location[] = [
  { id: 'costa-caparica', name: 'Costa da Caparica', lat: 38.6447, lng: -9.2354, description: 'Consistent beach break near Lisbon' },
  { id: 'tonel', name: 'Tonel Beach', lat: 37.0167, lng: -8.9833, description: 'Powerful waves in the Algarve' },
  { id: 'carcavelos', name: 'Carcavelos', lat: 38.6833, lng: -9.3333, description: 'Classic break close to Lisbon' },
]

export default function LocationOnboarding() {
  const [selected, setSelected] = useState<Location | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    await fetch('/api/user/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: { name: selected.name, lat: selected.lat, lng: selected.lng } }),
    })
    router.push('/onboarding/surf-conditions')
  }

  return (
    <OnboardingShell step={4} total={7} title="Where do you surf?" subtitle="Pick your home break">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Map */}
        <div className="rounded-xl overflow-hidden border border-border h-52">
          <GoogleMap locations={surfLocations} selectedLocation={selected} onLocationSelect={setSelected} />
        </div>

        {/* Location cards */}
        <div className="space-y-2">
          {surfLocations.map(loc => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelected(loc)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                selected?.id === loc.id
                  ? 'bg-primary/10 border-primary ring-1 ring-primary'
                  : 'bg-secondary border-border hover:border-primary/40'
              }`}
            >
              <MapPin className={`h-4 w-4 mt-0.5 flex-shrink-0 ${selected?.id === loc.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className={`font-semibold text-sm ${selected?.id === loc.id ? 'text-primary' : 'text-foreground'}`}>{loc.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{loc.description}</p>
              </div>
            </button>
          ))}
        </div>

        <Button
          type="submit"
          disabled={!selected}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </form>
    </OnboardingShell>
  )
}
