import { api } from './client'

export type Platform = 'GOOGLE' | 'FACEBOOK' | 'DEALERRATER' | 'YELP'
export type ReviewStatus = 'NEW' | 'PENDING_RESPONSE' | 'RESPONDED' | 'IGNORED'
export type ResponseStatus = 'DRAFT' | 'APPROVED' | 'POSTED' | 'FAILED'

export interface ReviewResponse {
  id: string
  generatedText: string
  finalText: string | null
  status: ResponseStatus
  approvedAt: string | null
  postedAt: string | null
}

export interface Review {
  id: string
  platform: Platform
  platformReviewId: string
  reviewerName: string
  rating: number | null
  reviewText: string
  reviewDate: string
  status: ReviewStatus
  createdAt: string
  response: ReviewResponse | null
}

export interface ReviewStats {
  total: number
  byStatus: Record<ReviewStatus, number>
  byPlatform: Record<Platform, number>
  avgRating: number | null
}

export interface ReportingStats {
  responseRate: number
  avgRating: number | null
  pendingCount: number
  totalReviews: number
  responsesGenerated: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface ReviewsResponse {
  data: Review[]
  pagination: PaginationInfo
  filters: {
    hideOldReviews: boolean
    oldReviewThresholdDays: number
  }
}

export interface ReviewFilters {
  status?: ReviewStatus
  platform?: Platform
  hasResponse?: boolean
  includeOld?: boolean
  page?: number
  limit?: number
}

export async function getReviews(filters?: ReviewFilters): Promise<ReviewsResponse> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.platform) params.set('platform', filters.platform)
  if (filters?.hasResponse !== undefined)
    params.set('hasResponse', String(filters.hasResponse))
  if (filters?.includeOld !== undefined)
    params.set('includeOld', String(filters.includeOld))
  if (filters?.page) params.set('page', String(filters.page))
  if (filters?.limit) params.set('limit', String(filters.limit))

  const query = params.toString()
  return api.get<ReviewsResponse>(`/reviews${query ? `?${query}` : ''}`)
}

export async function getReview(id: string): Promise<Review> {
  return api.get<Review>(`/reviews/${id}`)
}

export async function getReviewStats(): Promise<ReviewStats> {
  return api.get<ReviewStats>('/reviews/stats')
}

export async function getReportingStats(): Promise<ReportingStats> {
  return api.get<ReportingStats>('/reviews/reporting-stats')
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus
): Promise<Review> {
  return api.patch<Review>(`/reviews/${id}`, { status })
}

export async function generateResponse(reviewId: string): Promise<ReviewResponse> {
  return api.post<ReviewResponse>('/ai/generate', { reviewId })
}

export async function regenerateResponse(responseId: string): Promise<ReviewResponse> {
  return api.post<ReviewResponse>(`/ai/regenerate/${responseId}`)
}

export async function updateResponse(
  responseId: string,
  finalText: string
): Promise<ReviewResponse> {
  return api.patch<ReviewResponse>(`/responses/${responseId}`, { finalText })
}

export async function approveResponse(responseId: string): Promise<ReviewResponse> {
  return api.post<ReviewResponse>(`/responses/${responseId}/approve`)
}
