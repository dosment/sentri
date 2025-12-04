import { api } from './client'

export interface AdminDealer {
  id: string
  email: string
  name: string
  phone?: string
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  isAdmin: boolean
  createdAt: string
  _count: {
    reviews: number
    responses: number
  }
}

export interface DealerDetails extends AdminDealer {
  customInstructions?: string
  voiceProfile?: unknown
  autoApproveThreshold: number
  updatedAt: string
  reviewStats: Record<string, number>
  responseStats: Record<string, number>
}

export interface CreateDealerInput {
  email: string
  password: string
  name: string
  phone?: string
  plan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  customInstructions?: string
}

export interface UpdateDealerInput {
  name?: string
  phone?: string
  plan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE'
  customInstructions?: string
}

export async function getDealers(): Promise<AdminDealer[]> {
  return api.get<AdminDealer[]>('/admin/dealers')
}

export async function getDealer(id: string): Promise<DealerDetails> {
  return api.get<DealerDetails>(`/admin/dealers/${id}`)
}

export async function createDealer(input: CreateDealerInput): Promise<AdminDealer> {
  return api.post<AdminDealer>('/admin/dealers', input)
}

export async function updateDealer(id: string, input: UpdateDealerInput): Promise<AdminDealer> {
  return api.patch<AdminDealer>(`/admin/dealers/${id}`, input)
}
