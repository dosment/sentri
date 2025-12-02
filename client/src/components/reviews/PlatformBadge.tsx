import { Badge } from '@/components/ui/Badge'
import type { Platform } from '@/api/reviews'

interface PlatformBadgeProps {
  platform: Platform
}

const platformConfig: Record<Platform, { label: string; variant: 'info' | 'default' | 'danger' }> = {
  GOOGLE: { label: 'Google', variant: 'info' },
  FACEBOOK: { label: 'Facebook', variant: 'info' },
  DEALERRATER: { label: 'DealerRater', variant: 'default' },
  YELP: { label: 'Yelp', variant: 'danger' },
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const config = platformConfig[platform] || { label: platform, variant: 'default' }
  return <Badge variant={config.variant as any}>{config.label}</Badge>
}
