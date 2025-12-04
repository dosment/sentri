import { api } from './client'

export interface DealerSettings {
  autoPostEnabled: boolean
  autoPostThreshold: number
  negativeThreshold: number
  responseTone: 'professional' | 'neighborly'
  signOffName: string | null
  signOffTitle: string | null
}

export interface UpdateSettingsInput {
  autoPostEnabled?: boolean
  autoPostThreshold?: number
  negativeThreshold?: number
  responseTone?: 'professional' | 'neighborly'
  signOffName?: string | null
  signOffTitle?: string | null
}

export async function getSettings(): Promise<DealerSettings> {
  const response = await api.get('/settings')
  return response.data
}

export async function updateSettings(input: UpdateSettingsInput): Promise<DealerSettings> {
  const response = await api.patch('/settings', input)
  return response.data
}
