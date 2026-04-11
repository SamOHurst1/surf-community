'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try { await signIn('google', { callbackUrl: '/' }); }
    catch { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">

      {/* ── Left panel — editorial ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative p-12 overflow-hidden"
           style={{ background: 'linear-gradient(145deg, oklch(0.12 0.04 220) 0%, oklch(0.07 0.03 250) 100%)' }}>

        {/* Grain overlay */}
        <div className="absolute inset-0 grain pointer-events-none" />

        {/* Ambient orb */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
             style={{ background: 'radial-gradient(circle, oklch(0.76 0.175 192 / 0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
             style={{ background: 'radial-gradient(circle, oklch(0.76 0.175 192 / 0.08) 0%, transparent 70%)' }} />

        {/* Wordmark */}
        <div className="relative z-10">
          <span className="font-[family-name:var(--font-syne)] text-[11px] font-600 tracking-[0.22em] uppercase text-muted-foreground">
            Surf.Community
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <p className="font-[family-name:var(--font-syne)] text-[11px] font-600 tracking-[0.18em] uppercase text-primary mb-6">
            Your Ocean Network
          </p>
          <h1 className="font-[family-name:var(--font-syne)] font-800 text-[4.5rem] leading-[0.92] tracking-[-0.02em] text-foreground text-balance">
            Find your<br />
            <span className="text-primary">crew.</span><br />
            Catch the<br />swell.
          </h1>
          <p className="mt-8 text-muted-foreground text-sm leading-relaxed max-w-xs">
            Connect with surfers at your break, plan sessions, and track conditions together.
          </p>
        </div>

        {/* Bottom line */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-[10px] text-muted-foreground font-500 tracking-[0.12em] uppercase">Portugal & beyond</span>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-12 relative">

        {/* Mobile wordmark */}
        <div className="lg:hidden mb-12 text-center">
          <span className="font-[family-name:var(--font-syne)] text-base font-800 tracking-[0.18em] uppercase text-foreground">
            Surf<span className="text-primary">.</span>Community
          </span>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="font-[family-name:var(--font-syne)] font-700 text-2xl tracking-tight text-foreground mb-1">
            Sign in
          </h2>
          <p className="text-muted-foreground text-sm mb-8 font-300">
            New here? We&apos;ll set up your profile after sign in.
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="group w-full flex items-center gap-3 bg-foreground hover:bg-foreground/92 active:scale-[0.99] text-background font-600 py-3.5 px-5 rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm relative overflow-hidden"
          >
            {/* Shimmer */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/5 to-transparent" />
            {loading ? (
              <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="relative">{loading ? 'Signing in…' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">GitHub coming soon</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button disabled className="w-full flex items-center justify-center gap-2 bg-secondary text-muted-foreground py-3 px-5 rounded-xl opacity-35 cursor-not-allowed text-sm font-500">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          <p className="text-center text-[11px] text-muted-foreground mt-8 leading-relaxed">
            By signing in you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
