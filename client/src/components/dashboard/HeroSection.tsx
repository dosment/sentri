interface HeroSectionProps {
  dealerName: string
  responseRate?: number
  isStable?: boolean
}

export function HeroSection({ dealerName, responseRate = 100, isStable = true }: HeroSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statusMessage = isStable
    ? `Your reputation is stable. ${responseRate}% response rate this week.`
    : 'You have reviews that need attention.'

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sentri-blue to-guardian-navy mb-8">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight-brand mb-2">
          {getGreeting()}, {dealerName}
        </h1>
        <p className="text-white/80 text-lg">
          {statusMessage}
        </p>
      </div>
    </div>
  )
}
