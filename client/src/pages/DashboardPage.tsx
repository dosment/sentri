import { useState, useCallback } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ActionBar } from '@/components/dashboard/ActionBar'
import { AllCaughtUp } from '@/components/dashboard/AllCaughtUp'
import { ReviewList } from '@/components/reviews/ReviewList'
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist'
import type { Dealer } from '@/api/auth'

interface DashboardPageProps {
  dealer: Dealer
  onLogout: () => void
}

export function DashboardPage({ dealer, onLogout }: DashboardPageProps) {
  const [reviewStats, setReviewStats] = useState({ needsAttention: 0, total: 0 })
  const [statsLoaded, setStatsLoaded] = useState(false)

  const handleStatsChange = useCallback((stats: { needsAttention: number; total: number }) => {
    setReviewStats(stats)
    setStatsLoaded(true)
  }, [])

  const respondedCount = reviewStats.total - reviewStats.needsAttention
  const responseRate = reviewStats.total > 0
    ? Math.round((respondedCount / reviewStats.total) * 100)
    : 100

  const showAllCaughtUp = statsLoaded && reviewStats.needsAttention === 0 && reviewStats.total > 0

  return (
    <AppShell
      dealerName={dealer.name}
      pageTitle="Dashboard"
      newReviewCount={reviewStats.needsAttention}
      onLogout={onLogout}
    >
      {/* Onboarding Checklist - only shows if not complete */}
      <OnboardingChecklist />

      {/* Action Bar - shows when there are reviews needing attention */}
      {statsLoaded && reviewStats.needsAttention > 0 && (
        <ActionBar
          needsAttentionCount={reviewStats.needsAttention}
          totalCount={reviewStats.total}
          responseRate={responseRate}
        />
      )}

      {/* All Caught Up - celebration when no reviews need attention */}
      {showAllCaughtUp && (
        <AllCaughtUp
          totalResponded={respondedCount}
          responseRate={responseRate}
          avgRating={null}
          dealerName={dealer.name}
        />
      )}

      {/* Reviews - the core product */}
      <div className={showAllCaughtUp ? 'mt-8 pt-8 border-t border-gray-200' : ''}>
        <ReviewList onStatsChange={handleStatsChange} />
      </div>
    </AppShell>
  )
}
