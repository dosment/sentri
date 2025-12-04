import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { AIGeneratingState } from '@/components/ui/Shimmer'
import { StarRating } from './StarRating'
import { BoltIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [editedText, setEditedText] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleGenerate = async () => {
    setLoading(true)
    setIsGenerating(true)
    try {
      await generateResponse(review.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to generate response:', error)
    } finally {
      setLoading(false)
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    if (!review.response) return
    setLoading(true)
    setIsGenerating(true)
    try {
      await regenerateResponse(review.response.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to regenerate response:', error)
    } finally {
      setLoading(false)
      setIsGenerating(false)
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
  const needsAction = review.status === 'NEW' || review.status === 'PENDING_RESPONSE'
  const isApproved = review.response?.status === 'APPROVED'

  // Sentiment indicator
  const sentimentColor =
    review.rating && review.rating <= 2 ? 'bg-alert' :
    review.rating && review.rating >= 4 ? 'bg-success' :
    'bg-gray-300'

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden
      transition-all duration-200
      ${needsAction ? 'ring-2 ring-warning/20' : ''}
    `}>
      {/* Sentiment indicator bar */}
      <div className={`h-1 ${sentimentColor}`} />

      <div className="p-4 sm:p-6">
        {/* Header: Name, Stars, Time */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-600">
                {review.reviewerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-guardian-navy">{review.reviewerName}</span>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-sm text-gray-500">{formatTimeAgo(review.reviewDate)}</p>
            </div>
          </div>

          {/* Expand/Collapse for responded reviews on mobile */}
          {isApproved && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 sm:hidden"
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Review Text */}
        <p className="text-gray-700 leading-relaxed mb-4">
          {review.reviewText}
        </p>

        {/* Expandable content for mobile */}
        <div className={`${!isExpanded && isApproved ? 'hidden sm:block' : ''}`}>
          {/* AI Generating State */}
          {isGenerating && <AIGeneratingState />}

          {/* AI Response */}
          {review.response && !isGenerating && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <BoltIcon className="w-4 h-4 text-sentri-blue" />
                <span className="text-sm font-medium text-sentri-blue">AI Response</span>
                {isApproved && (
                  <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full ml-auto">
                    Posted
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
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
                <p className="text-gray-700 text-sm leading-relaxed">{responseText}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            {/* Left side: secondary actions */}
            <div className="flex gap-2">
              {review.response?.status === 'DRAFT' && !isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={loading}
                    className="text-gray-500"
                  >
                    Regenerate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    disabled={loading}
                    className="text-gray-500"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>

            {/* Right side: primary action */}
            <div>
              {!review.response && !isGenerating && (
                <Button onClick={handleGenerate} disabled={loading}>
                  Generate Response
                </Button>
              )}
              {review.response?.status === 'DRAFT' && !isEditing && (
                <Button
                  variant="success"
                  onClick={handleApprove}
                  disabled={loading}
                  className="min-w-[140px]"
                >
                  {loading ? 'Posting...' : 'Approve & Post'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Collapsed state indicator for mobile */}
        {!isExpanded && isApproved && (
          <div className="flex items-center gap-2 text-sm text-success sm:hidden">
            <BoltIcon className="w-4 h-4" />
            <span>Response posted</span>
          </div>
        )}
      </div>
    </div>
  )
}
