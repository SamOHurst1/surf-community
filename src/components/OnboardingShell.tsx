interface Props {
  step: number
  total: number
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function OnboardingShell({ step, total, title, subtitle, children }: Props) {

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute -top-60 -right-40 w-[500px] h-[500px] rounded-full"
           style={{ background: 'radial-gradient(circle, oklch(0.76 0.175 192 / 0.07) 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute -bottom-60 -left-40 w-[400px] h-[400px] rounded-full"
           style={{ background: 'radial-gradient(circle, oklch(0.76 0.175 192 / 0.04) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md">
        {/* Wordmark */}
        <div className="flex items-center justify-between mb-8">
          <span className="font-[family-name:var(--font-syne)] text-[11px] font-600 tracking-[0.2em] uppercase text-muted-foreground">
            Surf<span style={{ color: 'oklch(0.76 0.175 192)' }}>.</span>Community
          </span>
          <span className="font-[family-name:var(--font-syne)] font-700 text-sm tabular-nums"
                style={{ color: 'oklch(0.76 0.175 192)' }}>
            {String(step).padStart(2, '0')}<span className="text-muted-foreground font-300"> / {String(total).padStart(2, '0')}</span>
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-7">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                height: '3px',
                flex: 1,
                background: i < step
                  ? 'oklch(0.76 0.175 192)'
                  : i === step - 1
                  ? 'oklch(0.76 0.175 192 / 0.8)'
                  : 'oklch(0.22 0.022 248)',
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 p-8 sm:p-10 grain"
             style={{
               background: 'linear-gradient(160deg, oklch(0.13 0.022 248) 0%, oklch(0.10 0.018 252) 100%)',
               boxShadow: 'inset 0 1px 0 0 oklch(0.96 0.008 240 / 0.05), 0 24px 48px oklch(0 0 0 / 0.35)',
             }}>
          {/* Top accent line */}
          <div className="h-px w-12 mb-6 rounded-full" style={{ background: 'oklch(0.76 0.175 192)' }} />

          <h1 className="font-[family-name:var(--font-syne)] font-700 text-2xl tracking-tight text-foreground mb-2 leading-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mb-7 font-300 leading-relaxed">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
