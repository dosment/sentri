import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'

interface AppShellProps {
  children: React.ReactNode
  businessName: string
  pageTitle: string
  newReviewCount?: number
  onLogout: () => void
}

export function AppShell({
  children,
  businessName,
  pageTitle,
  newReviewCount = 0,
  onLogout,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar */}
      <Sidebar
        newReviewCount={newReviewCount}
        onLogout={onLogout}
      />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <AppHeader
          pageTitle={pageTitle}
          businessName={businessName}
        />

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
