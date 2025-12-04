import { ReactNode } from 'react'

type StatVariant = 'default' | 'urgent' | 'success' | 'neutral'

interface StatsCardProps {
  label: string
  value: string | number
  variant?: StatVariant
  icon?: ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
}

const variantStyles: Record<StatVariant, {
  border: string
  text: string
  bg: string
  animate?: boolean
}> = {
  default: {
    border: '',
    text: 'text-guardian-navy',
    bg: 'bg-white',
  },
  urgent: {
    border: 'border-t-4 border-t-warning',
    text: 'text-warning',
    bg: 'bg-white',
    animate: true,
  },
  success: {
    border: '',
    text: 'text-success',
    bg: 'bg-white',
  },
  neutral: {
    border: '',
    text: 'text-sentri-blue',
    bg: 'bg-white',
  },
}

export function StatsCard({ label, value, variant = 'default', icon, trend }: StatsCardProps) {
  const styles = variantStyles[variant]

  return (
    <div
      className={`
        ${styles.bg} ${styles.border}
        rounded-xl shadow-card p-5
        transition-all duration-small ease-in-out
        hover:shadow-card-hover hover:-translate-y-1
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p
            className={`
              text-3xl font-bold tabular-nums tracking-tight-brand
              ${styles.text}
              ${styles.animate ? 'animate-pulse-subtle' : ''}
            `}
          >
            {value}
          </p>

          {trend && (
            <p className={`text-sm mt-1 ${
              trend.direction === 'up' ? 'text-success' :
              trend.direction === 'down' ? 'text-alert' :
              'text-gray-500'
            }`}>
              {trend.direction === 'up' && '↑ '}
              {trend.direction === 'down' && '↓ '}
              {trend.value}
            </p>
          )}
        </div>

        {icon && (
          <div className={`p-2 rounded-lg ${variant === 'urgent' ? 'bg-warning/10 text-warning' : 'bg-gray-100 text-gray-500'}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-16 bg-gray-200 rounded" />
    </div>
  )
}
