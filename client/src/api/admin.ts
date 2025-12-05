import { api } from './client'
import type { BusinessType } from './auth'

export interface AdminBusiness {
  id: string
  email: string
  name: string
  phone?: string
  businessType: BusinessType
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  isAdmin: boolean
  createdAt: string
  _count: {
    reviews: number
    responses: number
  }
}

export interface BusinessDetails extends AdminBusiness {
  customInstructions?: string
  voiceProfile?: unknown
  autoPostThreshold: number
  updatedAt: string
  reviewStats: Record<string, number>
  responseStats: Record<string, number>
}

export interface CreateBusinessInput {
  email: string
  password: string
  name: string
  phone?: string
  businessType?: BusinessType
  plan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  customInstructions?: string
}

export interface UpdateBusinessInput {
  name?: string
  phone?: string
  businessType?: BusinessType
  plan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  customInstructions?: string
}

export async function getBusinesses(): Promise<AdminBusiness[]> {
  return api.get<AdminBusiness[]>('/admin/businesses')
}

export async function getBusiness(id: string): Promise<BusinessDetails> {
  return api.get<BusinessDetails>(`/admin/businesses/${id}`)
}

export async function createBusiness(input: CreateBusinessInput): Promise<AdminBusiness> {
  return api.post<AdminBusiness>('/admin/businesses', input)
}

export async function updateBusiness(id: string, input: UpdateBusinessInput): Promise<AdminBusiness> {
  return api.patch<AdminBusiness>(`/admin/businesses/${id}`, input)
}
