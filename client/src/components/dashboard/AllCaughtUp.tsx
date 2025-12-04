import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface AllCaughtUpProps {
  totalResponded: number
  responseRate: number
  avgRating: number | null
  dealerName: string
}

export function AllCaughtUp({ totalResponded, responseRate, avgRating, dealerName }: AllCaughtUpProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
        <CheckCircleIcon className="w-8 h-8 text-success" />
      </div>

      <h2 className="text-2xl font-bold text-guardian-navy mb-2">
        All caught up
      </h2>

      <div className="flex items-center gap-6 text-center mb-6">
        <div>
          <p className="text-2xl font-bold text-guardian-navy">{totalResponded}</p>
          <p className="text-sm text-gray-500">responded</p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <p className="text-2xl font-bold text-guardian-navy">{responseRate}%</p>
          <p className="text-sm text-gray-500">response rate</p>
        </div>
        {avgRating && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-guardian-navy">{avgRating.toFixed(1)}</p>
              <p className="text-sm text-gray-500">avg rating</p>
            </div>
          </>
        )}
      </div>

      <p className="text-gray-600">
        Great work, {dealerName}.
      </p>
    </div>
  )
}
