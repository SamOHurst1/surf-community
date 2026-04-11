'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Compass, MessageCircle, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { href: '/',          label: 'Discover',  icon: Compass },
  { href: '/messages',  label: 'Messages',  icon: MessageCircle },
  { href: '/profile',   label: 'Profile',   icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (href: string) => pathname === href;
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session?.user) return;

    const fetchUnread = () => {
      fetch('/api/messages/unread')
        .then(r => r.json())
        .then(d => setUnread(d.count ?? 0))
        .catch(() => {})
    };

    fetchUnread();
    // Clear badge when on messages page
    if (pathname === '/messages') setUnread(0);

    const interval = setInterval(fetchUnread, 30_000);
    return () => clearInterval(interval);
  }, [session, pathname]);

  return (
    <>
      {/* ── Desktop top bar ── */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 h-[4.5rem] border-b border-border/40"
           style={{ background: 'oklch(0.09 0.022 248 / 0.92)', backdropFilter: 'blur(20px) saturate(1.4)' }}>
        <div className="h-full max-w-6xl mx-auto px-8 lg:px-10 flex items-center gap-10">
          {/* Wordmark */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-[family-name:var(--font-syne)] text-sm font-800 tracking-[0.18em] uppercase text-foreground">
              Surf<span className="text-primary">.</span>Community
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-2 py-2 text-sm font-[family-name:var(--font-syne)] font-600 tracking-wide transition-colors duration-150 ${
                  isActive(href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="relative">
                  <Icon className="h-4 w-4 shrink-0" />
                  {href === '/messages' && unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center text-[9px] font-[family-name:var(--font-syne)] font-700 text-primary-foreground px-0.5"
                          style={{ background: 'oklch(0.76 0.175 192)' }}>
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </span>
                {label}
                {isActive(href) && (
                  <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right */}
          {session?.user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-1 ring-border/60">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-[family-name:var(--font-syne)] font-700">
                    {session.user.name?.charAt(0) ?? 'S'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hidden lg:block">
                  {session.user.name?.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40"
           style={{ background: 'oklch(0.10 0.022 248 / 0.97)', backdropFilter: 'blur(24px)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around px-4 pt-3 pb-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 flex-1 transition-all duration-150"
              >
                <div className={`relative flex items-center justify-center w-14 h-9 rounded-2xl transition-all duration-200 ${active ? 'bg-primary/15' : ''}`}>
                  <Icon className={`h-[22px] w-[22px] transition-colors ${active ? 'text-primary' : 'text-muted-foreground/70'}`} />
                  {href === '/messages' && unread > 0 && (
                    <span className="absolute top-0.5 right-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-[family-name:var(--font-syne)] font-700 text-primary-foreground px-1"
                          style={{ background: 'oklch(0.76 0.175 192)' }}>
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-[family-name:var(--font-syne)] font-600 tracking-wide transition-colors ${active ? 'text-primary' : 'text-muted-foreground/60'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
