import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { getReviewStats, type ReviewStats } from '@/api/reviews'
import type { Dealer } from '@/api/auth'
import { ChartBarIcon } from '@heroicons/react/24/outline'

interface ReportsPageProps {
  dealer: Dealer
  onLogout: () => void
}

export function ReportsPage({ dealer, onLogout }: ReportsPageProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null)

  useEffect(() => {
    getReviewStats()
      .then(setStats)
      .catch(console.error)
  }, [])

  const newReviewCount = stats?.byStatus?.NEW || 0

  return (
    <AppShell
      dealerName={dealer.name}
      pageTitle="Reports"
      newReviewCount={newReviewCount}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-guardian-navy mb-2">
            Reports Coming Soon
          </h2>
          <p className="text-gray-600">
            Analytics and reporting features are under development.
          </p>
        </Card>
      </div>
    </AppShell>
  )
}
