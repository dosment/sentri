interface ShimmerProps {
  className?: string
}

export function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 shimmer-bg animate-shimmer" />
    </div>
  )
}

export function AIGeneratingState() {
  return (
    <div className="bg-slate-50 border-l-4 border-l-sentri-blue/30 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-4 h-4 rounded bg-sentri-blue/20 animate-pulse" />
        <span className="text-sm font-medium text-sentri-blue animate-pulse-subtle">
          Sentri is crafting a response...
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 shimmer-bg animate-shimmer" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-5/6 relative overflow-hidden">
          <div className="absolute inset-0 shimmer-bg animate-shimmer" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="h-4 bg-slate-200 rounded w-4/6 relative overflow-hidden">
          <div className="absolute inset-0 shimmer-bg animate-shimmer" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}
