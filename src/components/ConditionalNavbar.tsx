'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  
    // Hide navbar on auth pages and onboarding
  if (pathname.startsWith('/onboarding') || 
      pathname === '/login' || 
      pathname === '/signup') {
    return null
  }
  
  return <Navbar />
} 