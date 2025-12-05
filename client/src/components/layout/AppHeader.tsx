interface AppHeaderProps {
  pageTitle: string
  businessName: string
}

export function AppHeader({ pageTitle, businessName }: AppHeaderProps) {
  // Truncate long business names
  const maxLength = 30
  const displayName = businessName.length > maxLength
    ? `${businessName.slice(0, maxLength)}...`
    : businessName

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Page title - hidden on mobile where hamburger is */}
          <h1 className="text-lg font-semibold text-guardian-navy tracking-tight-brand pl-12 lg:pl-0">
            {pageTitle}
          </h1>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span>Monitoring</span>
            </div>

            {/* Business name */}
            <span
              className="text-sm text-gray-700 font-medium max-w-[200px] truncate"
              title={businessName}
            >
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
