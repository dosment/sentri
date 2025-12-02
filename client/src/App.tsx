import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'

export default function App() {
  const { dealer, loading, isAuthenticated, login, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sentri-blue"></div>
      </div>
    )
  }

  if (!isAuthenticated || !dealer) {
    return <LoginPage onLogin={login} />
  }

  return <DashboardPage dealer={dealer} onLogout={logout} />
}
