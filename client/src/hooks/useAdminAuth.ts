import { useState, useEffect } from 'react'
import {
  getAdminMe,
  adminLogout,
  isAdminSession,
  type AdminUser,
} from '@/api/auth'

export function useAdminAuth() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdminSession()) {
      getAdminMe()
        .then(setAdmin)
        .catch(() => {
          adminLogout()
          setAdmin(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (admin: AdminUser) => setAdmin(admin)

  const logout = () => {
    adminLogout()
    setAdmin(null)
  }

  return { admin, loading, login, logout }
}
