import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AdminPage } from '@/pages/AdminPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Admin routes have their own isolated auth
  if (isAdminRoute) {
    return <AdminApp />
  }

  // Regular dealer app
  return <DealerApp />
}

function AdminApp() {
  const { admin, loading, login, logout } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-guardian-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!admin) {
    return <AdminLoginPage onLogin={login} />
  }

  return (
    <Routes>
      <Route path="/admin" element={<AdminPage admin={admin} onLogout={logout} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

function DealerApp() {
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

  return (
    <Routes>
      <Route path="/" element={<DashboardPage dealer={dealer} onLogout={logout} />} />
      <Route path="/reports" element={<ReportsPage dealer={dealer} onLogout={logout} />} />
      <Route path="/settings" element={<SettingsPage dealer={dealer} onLogout={logout} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
