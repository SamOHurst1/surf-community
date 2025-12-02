'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function OnboardingNavbar() {
  const pathname = usePathname()
  
  // Hide navbar during onboarding
  if (pathname.startsWith('/onboarding')) {
    return null
  }
  
  return <Navbar />
} 