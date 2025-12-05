import { useEffect, useState } from 'react'
import { StatsCard, StatsCardSkeleton } from './StatsCard'
import { getReportingStats, ReportingStats as ReportingStatsType } from '@/api/reviews'

export function ReportingStats() {
  const [stats, setStats] = useState<ReportingStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getReportingStats()
        setStats(data)
      } catch (err) {
        setError('Unable to load stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return null
  }

  const formattedRating = stats.avgRating !== null
    ? stats.avgRating.toFixed(1)
    : '—'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Response Rate"
          value={`${stats.responseRate}%`}
          variant={stats.responseRate >= 90 ? 'success' : stats.responseRate >= 70 ? 'neutral' : 'urgent'}
        />
        <StatsCard
          label="Avg. Rating"
          value={formattedRating}
          variant={stats.avgRating !== null && stats.avgRating >= 4.0 ? 'success' : 'neutral'}
        />
        <StatsCard
          label="Needs Response"
          value={stats.pendingCount}
          variant={stats.pendingCount > 0 ? 'urgent' : 'success'}
        />
        <StatsCard
          label="Total Reviews"
          value={stats.totalReviews}
          variant="neutral"
        />
      </div>

      {stats.responsesGenerated > 0 && (
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-sentri-blue">{stats.responsesGenerated}</span>
          {' '}response{stats.responsesGenerated !== 1 ? 's' : ''} written by Sentri.
        </p>
      )}
    </div>
  )
}
