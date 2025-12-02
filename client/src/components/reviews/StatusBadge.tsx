import { Badge } from '@/components/ui/Badge'
import type { ReviewStatus, ResponseStatus } from '@/api/reviews'

interface ReviewStatusBadgeProps {
  status: ReviewStatus
}

interface ResponseStatusBadgeProps {
  status: ResponseStatus
}

const reviewStatusConfig: Record<ReviewStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  NEW: { label: 'New', variant: 'info' },
  PENDING_RESPONSE: { label: 'Pending', variant: 'warning' },
  RESPONDED: { label: 'Responded', variant: 'success' },
  IGNORED: { label: 'Ignored', variant: 'default' },
}

const responseStatusConfig: Record<ResponseStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  DRAFT: { label: 'Draft', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'info' },
  POSTED: { label: 'Posted', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'danger' },
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  const config = reviewStatusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function ResponseStatusBadge({ status }: ResponseStatusBadgeProps) {
  const config = responseStatusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
