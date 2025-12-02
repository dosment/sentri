import { useState, useEffect, useCallback } from 'react'
import { Dealer, getMe, login as apiLogin, logout as apiLogout, isAuthenticated } from '@/api/auth'

export function useAuth() {
  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated()) {
      getMe()
        .then(setDealer)
        .catch(() => {
          apiLogout()
          setDealer(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password)
    setDealer(result.dealer)
    return result
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setDealer(null)
  }, [])

  return {
    dealer,
    loading,
    isAuthenticated: !!dealer,
    login,
    logout,
  }
}
