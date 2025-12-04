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

export interface AdminUser {
  id: string
  email: string
  name: string
  isAdmin: true
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

export interface OnboardingStep {
  id: string
  label: string
  completed: boolean
}

export interface OnboardingStatus {
  steps: OnboardingStep[]
  completedCount: number
  totalCount: number
  isComplete: boolean
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  return api.get<OnboardingStatus>('/auth/onboarding')
}

// Admin-specific auth functions
export interface AdminAuthResult {
  admin: AdminUser
  token: string
}

export async function adminLogin(email: string, password: string): Promise<AdminAuthResult> {
  const result = await api.post<{ dealer: AdminUser; token: string }>('/auth/login', { email, password })

  // Verify this user is actually an admin
  if (!result.dealer.isAdmin) {
    throw new Error('Access denied. Admin privileges required.')
  }

  api.setToken(result.token)
  localStorage.setItem('sentri_admin_session', 'true')
  return { admin: result.dealer, token: result.token }
}

export async function getAdminMe(): Promise<AdminUser> {
  const user = await api.get<AdminUser>('/auth/me')
  if (!user.isAdmin) {
    throw new Error('Access denied. Admin privileges required.')
  }
  return user
}

export function adminLogout() {
  api.setToken(null)
  localStorage.removeItem('sentri_admin_session')
}

export function isAdminSession(): boolean {
  return localStorage.getItem('sentri_admin_session') === 'true'
}
