import { api } from './client'

export type BusinessType =
  | 'RESTAURANT'
  | 'SALON_SPA'
  | 'MEDICAL_OFFICE'
  | 'DENTAL_OFFICE'
  | 'LEGAL_SERVICES'
  | 'HOME_SERVICES'
  | 'RETAIL'
  | 'AUTOMOTIVE'
  | 'FITNESS'
  | 'HOSPITALITY'
  | 'REAL_ESTATE'
  | 'OTHER'

export interface Business {
  id: string
  email: string
  name: string
  phone?: string
  businessType: BusinessType
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  googleReviewUrl?: string | null
  createdAt: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  isAdmin: true
}

export interface AuthResult {
  business: Business
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
  name: string,
  businessType?: BusinessType
): Promise<AuthResult> {
  const result = await api.post<AuthResult>('/auth/register', {
    email,
    password,
    name,
    businessType,
  })
  api.setToken(result.token)
  return result
}

export async function getMe(): Promise<Business> {
  return api.get<Business>('/auth/me')
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
  const result = await api.post<{ business: AdminUser; token: string }>('/auth/login', { email, password })

  // Verify this user is actually an admin
  if (!result.business.isAdmin) {
    throw new Error('Access denied. Admin privileges required.')
  }

  api.setToken(result.token)
  localStorage.setItem('sentri_admin_session', 'true')
  return { admin: result.business, token: result.token }
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
