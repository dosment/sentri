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
        <div className="text-center py-12 text-gray-500">
          No reviews found
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
