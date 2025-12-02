import { api } from './client'

export interface Dealer {
  id: string
  email: string
  name: string
  phone?: string
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  autoApproveThreshold: number
  createdAt: string
}

export interface AuthResult {
  dealer: Dealer
  token: string
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const result = await api.post<AuthResult>('/auth/login', { email, password })
  api.setToken(result.token)
  return result
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  const result = await api.post<AuthResult>('/auth/register', {
    email,
    password,
    name,
  })
  api.setToken(result.token)
  return result
}

export async function getMe(): Promise<Dealer> {
  return api.get<Dealer>('/auth/me')
}

export function logout() {
  api.setToken(null)
}

export function isAuthenticated(): boolean {
  return !!api.getToken()
}
