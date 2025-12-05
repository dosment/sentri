import { useState, useEffect, useCallback } from 'react'
import { Business, getMe, login as apiLogin, logout as apiLogout, isAuthenticated } from '@/api/auth'

export function useAuth() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated()) {
      getMe()
        .then(setBusiness)
        .catch(() => {
          apiLogout()
          setBusiness(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password)
    setBusiness(result.business)
    return result
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setBusiness(null)
  }, [])

  return {
    business,
    loading,
    isAuthenticated: !!business,
    login,
    logout,
  }
}
