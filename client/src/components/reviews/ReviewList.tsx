import { useState, useEffect, useCallback } from 'react'
import { ReviewCard } from './ReviewCard'
import { Button } from '@/components/ui/Button'
import { ReviewCardSkeleton } from '@/components/ui/Skeleton'
import { getReviews, type Review, type ReviewStatus } from '@/api/reviews'

type FilterStatus = ReviewStatus | 'ALL'

export function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('ALL')

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const filters = filter !== 'ALL' ? { status: filter } : undefined
      const data = await getReviews(filters)
      setReviews(data)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'New', value: 'NEW' },
    { label: 'Pending', value: 'PENDING_RESPONSE' },
    { label: 'Responded', value: 'RESPONDED' },
  ]

  if (loading) {
    return (
      <div>
        <div className="flex space-x-2 mb-6">
          {filters.map(({ label, value }) => (
            <Button
              key={value}
              variant={filter === value ? 'primary' : 'secondary'}
              size="sm"
              disabled
            >
              {label}
            </Button>
          ))}
        </div>
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
        <ReviewCardSkeleton />
      </div>
    )
  }

  return (
    <div>
      <div className="flex space-x-2 mb-6">
        {filters.map(({ label, value }) => (
          <Button
            key={value}
            variant={filter === value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            {filter === 'ALL'
              ? "Connect your Google Business Profile to start monitoring reviews. We'll check for new reviews every hour."
              : "No reviews match this filter. Try selecting a different status."}
          </p>
          {filter === 'ALL' && (
            <div className="relative inline-block group">
              <Button variant="primary" disabled className="cursor-not-allowed opacity-60">
                Connect Google Account
              </Button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onUpdate={fetchReviews} />
          ))}
        </div>
      )}
    </div>
  )
}
