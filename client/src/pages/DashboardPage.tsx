import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { ReviewList } from '@/components/reviews/ReviewList'
import { Card, CardContent } from '@/components/ui/Card'
import { getReviewStats, type ReviewStats } from '@/api/reviews'
import type { Dealer } from '@/api/auth'

interface DashboardPageProps {
  dealer: Dealer
  onLogout: () => void
}

export function DashboardPage({ dealer, onLogout }: DashboardPageProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null)

  useEffect(() => {
    getReviewStats().then(setStats).catch(console.error)
  }, [])

  return (
    <Layout dealerName={dealer.name} onLogout={onLogout}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your reviews and responses</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-sentri-blue">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">
                {stats.byStatus?.NEW || 0}
              </p>
              <p className="text-sm text-gray-600">New Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">
                {stats.byStatus?.RESPONDED || 0}
              </p>
              <p className="text-sm text-gray-600">Responded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-guardian-navy">
                {stats.avgRating?.toFixed(1) || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
        <ReviewList />
      </div>
    </Layout>
  )
}
