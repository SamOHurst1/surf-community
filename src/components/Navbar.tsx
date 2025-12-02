'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding (logged in)
    const onboardingComplete = localStorage.getItem('onboarding_complete');
    const firstName = localStorage.getItem('onboarding_firstName');
    const email = localStorage.getItem('onboarding_email');
    
    // User is logged in if they have completed onboarding OR have profile data
    setIsLoggedIn(!!onboardingComplete || !!(firstName && email));
  }, []);



  const handleSignOut = () => {
    // Clear all onboarding data
    localStorage.removeItem('onboarding_complete');
    localStorage.removeItem('onboarding_email');
    localStorage.removeItem('onboarding_firstName');
    localStorage.removeItem('onboarding_lastName');
    localStorage.removeItem('onboarding_mobile');
    localStorage.removeItem('onboarding_age');
    localStorage.removeItem('onboarding_location');
    localStorage.removeItem('onboarding_location_lat');
    localStorage.removeItem('onboarding_location_lng');
    localStorage.removeItem('onboarding_surfConditions');
    localStorage.removeItem('onboarding_abilityLevel');
    localStorage.removeItem('onboarding_boardSize');
    
    // Redirect to signup
    router.push('/signup');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-card shadow-lg border-b border-border sticky top-0 z-50 text-foreground" >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Logo/Brand */}
            <div className="flex-shrink-0" style={{ marginLeft: '40px' }}>
              <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                🏄 Surf Community
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-12 flex items-center">
                <Link
                  href="/"
                  className={`px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    isActive('/') 
                      ? '' 
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                  style={{ 
                    marginRight: '20px', 
                    marginLeft: '20px',
                    color: isActive('/') ? '#14b8a6' : undefined
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/profile"
                  className={`px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    isActive('/profile') 
                      ? '' 
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                  style={{ 
                    marginRight: '20px',
                    color: isActive('/profile') ? '#14b8a6' : undefined
                  }}
                >
                  Profile
                </Link>
                <Link
                  href="/messages"
                  className={`px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    isActive('/messages') 
                      ? '' 
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                  style={{ 
                    color: isActive('/messages') ? '#14b8a6' : undefined
                  }}
                >
                  Messages
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Sign out button and Mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Sign out button */}
            <div className="hidden md:block">
              {isLoggedIn && (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="bg-secondary p-2 rounded-lg text-foreground hover:text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                style={{ marginRight: '20px' }}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`md:hidden fixed top-20 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ marginLeft: '200px' }}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-card/95 backdrop-blur-sm border-b border-border shadow-2xl">
          <Link
            href="/"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/') 
                ? 'text-teal-500' 
                : 'text-muted-foreground hover:text-teal-500 hover:bg-accent/50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/profile"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/profile') 
                ? 'text-teal-500' 
                : 'text-muted-foreground hover:text-teal-500 hover:bg-accent/50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/messages"
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/messages') 
                ? 'text-teal-500' 
                : 'text-muted-foreground hover:text-teal-500 hover:bg-accent/50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Messages
          </Link>
          {isLoggedIn && (
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-base font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}