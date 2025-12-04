interface ActionBarProps {
  needsAttentionCount: number
  totalCount: number
  responseRate: number
}

export function ActionBar({ needsAttentionCount, totalCount, responseRate }: ActionBarProps) {
  if (needsAttentionCount === 0) {
    return null // Let the AllCaughtUp component handle this
  }

  return (
    <div className="flex items-center justify-between py-4 mb-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning/10">
          <span className="text-lg font-bold text-warning">{needsAttentionCount}</span>
        </div>
        <div>
          <p className="font-semibold text-guardian-navy">
            {needsAttentionCount === 1 ? '1 review needs' : `${needsAttentionCount} reviews need`} your response
          </p>
          <p className="text-sm text-gray-500">
            {totalCount} total · {responseRate}% response rate
          </p>
        </div>
      </div>
    </div>
  )
}
