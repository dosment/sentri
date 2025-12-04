import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { getOnboardingStatus, type OnboardingStatus } from '@/api/auth'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('w-5 h-5', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

interface OnboardingChecklistProps {
  onDismiss?: () => void
}

export function OnboardingChecklist({ onDismiss }: OnboardingChecklistProps) {
  const [status, setStatus] = useState<OnboardingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('onboarding_dismissed') === 'true'
  })

  useEffect(() => {
    getOnboardingStatus()
      .then(setStatus)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('onboarding_dismissed', 'true')
    setDismissed(true)
    onDismiss?.()
  }

  // Don't show if dismissed, loading, or complete
  if (dismissed || loading || !status || status.isComplete) {
    return null
  }

  const progressPercent = (status.completedCount / status.totalCount) * 100

  return (
    <Card className="mb-6 border-sentri-blue/20 bg-gradient-to-r from-sentri-blue/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-guardian-navy">
              Get started with Sentri
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete these steps to start automating your review responses
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Dismiss onboarding"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-sentri-blue">
              {status.completedCount} of {status.totalCount} complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sentri-blue rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <ul className="space-y-3">
          {status.steps.map((step, index) => (
            <li key={step.id} className="flex items-center gap-3">
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                  step.completed
                    ? 'bg-success text-white'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {step.completed ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-sm',
                  step.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                )}
              >
                {step.label}
              </span>
              {step.id === 'google_connected' && !step.completed && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="ml-auto"
                  disabled
                  title="Coming Soon"
                >
                  Connect
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
