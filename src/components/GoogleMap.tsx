'use client'

import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  description: string
}

interface GoogleMapProps {
  locations: Location[]
  selectedLocation: Location | null
  onLocationSelect: (location: Location) => void
}

const MapComponent: React.FC<GoogleMapProps> = ({ locations, selectedLocation, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 37.5, lng: -8.5 }, // Center of Portugal
        zoom: 7,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#a2daf2' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f2' }]
          }
        ]
      })
      setMap(newMap)
    }
  }, [map])

  useEffect(() => {
    if (map && locations.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null))
      
      const newMarkers = locations.map(location => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
          icon: {
            url: selectedLocation?.id === location.id 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #1f2937;">${location.name}</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">${location.description}</p>
            </div>
          `
        })

        marker.addListener('click', () => {
          onLocationSelect(location)
          infoWindow.open(map, marker)
        })

        return marker
      })

      setMarkers(newMarkers)
    }
  }, [map, locations, selectedLocation, onLocationSelect])

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-full">Loading map...</div>
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-full text-red-500">Failed to load map</div>
    default:
      return <div className="flex items-center justify-center h-full">Loading map...</div>
  }
}

const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} render={render}>
      <MapComponent {...props} />
    </Wrapper>
  )
}

export default GoogleMap 