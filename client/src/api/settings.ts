import { api } from './client'

export type ResponseTone = 'professional' | 'neighborly' | 'casual' | 'humorous'

export interface BusinessSettings {
  autoPostEnabled: boolean
  autoPostThreshold: number
  negativeThreshold: number
  responseTone: ResponseTone
  signOffName: string | null
  signOffTitle: string | null
  googleReviewUrl: string | null
  phone: string | null
  hideOldReviews: boolean
  oldReviewThresholdDays: number
}

export interface UpdateSettingsInput {
  autoPostEnabled?: boolean
  autoPostThreshold?: number
  negativeThreshold?: number
  responseTone?: ResponseTone
  signOffName?: string | null
  signOffTitle?: string | null
  googleReviewUrl?: string | null
  phone?: string | null
  hideOldReviews?: boolean
  oldReviewThresholdDays?: number
}

export async function getSettings(): Promise<BusinessSettings> {
  return api.get<BusinessSettings>('/settings')
}

export async function updateSettings(input: UpdateSettingsInput): Promise<BusinessSettings> {
  return api.patch<BusinessSettings>('/settings', input)
}
