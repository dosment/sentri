import { Button } from '@/components/ui/Button'

interface HeaderProps {
  dealerName: string
  onLogout: () => void
}

export function Header({ dealerName, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sentri-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg text-guardian-navy">Sentri</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{dealerName}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
