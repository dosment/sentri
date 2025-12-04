import { useState, useEffect, useCallback } from 'react'
import { ReviewCard } from './ReviewCard'
import { ReviewCardSkeleton } from '@/components/ui/Skeleton'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { getReviews, type Review, type ReviewStatus } from '@/api/reviews'

type FilterStatus = ReviewStatus | 'ALL' | 'NEEDS_ATTENTION'

interface ReviewListProps {
  onStatsChange?: (stats: { needsAttention: number; total: number }) => void
}

export function ReviewList({ onStatsChange }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('NEEDS_ATTENTION')

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      // Always fetch all reviews, then filter client-side for "needs attention"
      const data = await getReviews()
      setReviews(data)

      // Calculate stats
      const needsAttention = data.filter(
        r => r.status === 'NEW' || r.status === 'PENDING_RESPONSE'
      ).length
      onStatsChange?.({ needsAttention, total: data.length })
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [onStatsChange])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'Needs attention', value: 'NEEDS_ATTENTION' },
    { label: 'All reviews', value: 'ALL' },
    { label: 'Responded', value: 'RESPONDED' },
  ]

  // Filter reviews based on selection
  const filteredReviews = reviews.filter(review => {
    if (filter === 'ALL') return true
    if (filter === 'NEEDS_ATTENTION') {
      return review.status === 'NEW' || review.status === 'PENDING_RESPONSE'
    }
    return review.status === filter
  })

  // Sort: needs attention first, then by date
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const aNeeds = a.status === 'NEW' || a.status === 'PENDING_RESPONSE'
    const bNeeds = b.status === 'NEW' || b.status === 'PENDING_RESPONSE'
    if (aNeeds && !bNeeds) return -1
    if (!aNeeds && bNeeds) return 1
    return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
  })

  if (loading) {
    return (
      <div>
        <div className="h-10 w-40 bg-gray-100 rounded-lg mb-4 animate-pulse" />
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
      </div>
    )
  }

  return (
    <div>
      {/* Subtle dropdown filter */}
      <div className="relative inline-block mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterStatus)}
          className="appearance-none bg-transparent text-sm text-gray-600 font-medium pr-6 py-1 cursor-pointer focus:outline-none focus:text-guardian-navy"
        >
          {filters.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {sortedReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filter === 'NEEDS_ATTENTION'
              ? 'No reviews need attention right now.'
              : filter === 'RESPONDED'
              ? 'No responded reviews yet.'
              : 'No reviews yet.'}
          </p>
        </div>
      ) : (
        <div>
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onUpdate={fetchReviews} />
          ))}
        </div>
      )}
    </div>
  )
}
