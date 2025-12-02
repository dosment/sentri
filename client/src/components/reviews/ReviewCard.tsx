import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StarRating } from './StarRating'
import { PlatformBadge } from './PlatformBadge'
import { ReviewStatusBadge, ResponseStatusBadge } from './StatusBadge'
import type { Review } from '@/api/reviews'
import {
  generateResponse,
  regenerateResponse,
  updateResponse,
  approveResponse,
} from '@/api/reviews'

interface ReviewCardProps {
  review: Review
  onUpdate: () => void
}

export function ReviewCard({ review, onUpdate }: ReviewCardProps) {
  const [loading, setLoading] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      await generateResponse(review.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to generate response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!review.response) return
    setLoading(true)
    try {
      await regenerateResponse(review.response.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to regenerate response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditedText(review.response?.finalText || review.response?.generatedText || '')
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!review.response) return
    setLoading(true)
    try {
      await updateResponse(review.response.id, editedText)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Failed to save response:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!review.response) return
    setLoading(true)
    try {
      await approveResponse(review.response.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to approve response:', error)
    } finally {
      setLoading(false)
    }
  }

  const responseText = review.response?.finalText || review.response?.generatedText

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <PlatformBadge platform={review.platform} />
            <ReviewStatusBadge status={review.status} />
            {review.response && (
              <ResponseStatusBadge status={review.response.status} />
            )}
          </div>
          <span className="text-sm text-gray-500">{formatDate(review.reviewDate)}</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">{review.reviewerName}</span>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-gray-700">{review.reviewText}</p>
        </div>

        {review.response && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Response</span>
              {review.response.status === 'DRAFT' && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={loading}
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue"
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-sm">{responseText}</p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {!review.response && (
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Response'}
            </Button>
          )}
          {review.response?.status === 'DRAFT' && !isEditing && (
            <Button onClick={handleApprove} disabled={loading}>
              {loading ? 'Approving...' : 'Approve'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
