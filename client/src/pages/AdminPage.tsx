import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  type AdminBusiness,
  type BusinessDetails,
  type CreateBusinessInput,
} from '@/api/admin'
import type { AdminUser, BusinessType } from '@/api/auth'
import {
  PlusIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'

interface AdminPageProps {
  admin: AdminUser
  onLogout: () => void
}

const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  RESTAURANT: 'Restaurant',
  SALON_SPA: 'Salon/Spa',
  MEDICAL_OFFICE: 'Medical Office',
  DENTAL_OFFICE: 'Dental Office',
  LEGAL_SERVICES: 'Legal Services',
  HOME_SERVICES: 'Home Services',
  RETAIL: 'Retail',
  AUTOMOTIVE: 'Automotive',
  FITNESS: 'Fitness',
  HOSPITALITY: 'Hospitality',
  REAL_ESTATE: 'Real Estate',
  OTHER: 'Other',
}

export function AdminPage({ admin, onLogout }: AdminPageProps) {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDetails | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    try {
      const data = await getBusinesses()
      setBusinesses(data)
    } catch (error) {
      console.error('Failed to load businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleViewBusiness(id: string) {
    setDetailLoading(true)
    try {
      const data = await getBusiness(id)
      setSelectedBusiness(data)
    } catch (error) {
      console.error('Failed to load business:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleCreateBusiness(input: CreateBusinessInput) {
    await createBusiness(input)
    setShowAddModal(false)
    loadBusinesses()
  }

  async function handleUpdateBusiness(id: string, customInstructions: string) {
    await updateBusiness(id, { customInstructions })
    if (selectedBusiness) {
      setSelectedBusiness({ ...selectedBusiness, customInstructions })
    }
    loadBusinesses()
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="bg-guardian-navy text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sentri-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-lg">Sentri Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm">{admin.email}</span>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white/70 hover:text-white">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-guardian-navy">Businesses</h1>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Business
          </Button>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading businesses...</div>
          ) : businesses.length === 0 ? (
            <div className="p-8 text-center">
              <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No businesses yet</p>
              <Button onClick={() => setShowAddModal(true)} className="mt-4">
                Add your first business
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {businesses.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sentri-blue/10 rounded-full flex items-center justify-center">
                          <span className="text-sentri-blue font-medium text-sm">
                            {b.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-guardian-navy">{b.name}</div>
                          {b.isAdmin && (
                            <span className="text-xs text-sentri-blue font-medium">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {BUSINESS_TYPE_LABELS[b.businessType]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {b.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        b.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                        b.plan === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {b.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {b._count.reviews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBusiness(b.id)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </main>

      {/* Add Business Modal */}
      {showAddModal && (
        <AddBusinessModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateBusiness}
        />
      )}

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          loading={detailLoading}
          onClose={() => setSelectedBusiness(null)}
          onSave={handleUpdateBusiness}
        />
      )}
    </div>
  )
}

// Plan tier descriptions
const PLAN_INFO = {
  STARTER: {
    platforms: ['Google', 'Facebook'],
    target: 'Single location businesses',
    features: ['AI-powered responses', 'Approval workflow', '2 review platforms'],
  },
  PROFESSIONAL: {
    platforms: ['Google', 'Facebook', 'Yelp', 'TripAdvisor'],
    target: 'Active businesses wanting full coverage',
    features: ['All Starter features', 'All 4 review platforms', 'Priority support'],
  },
  ENTERPRISE: {
    platforms: ['Google', 'Facebook', 'Yelp', 'TripAdvisor'],
    target: 'Business groups with multiple locations',
    features: ['All Professional features', 'Multi-location management', 'Dedicated support'],
  },
} as const

function PlanDescription({ plan }: { plan: keyof typeof PLAN_INFO }) {
  const info = PLAN_INFO[plan]
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1.5">{info.target}</p>
          <div className="flex flex-wrap gap-1.5">
            {info.platforms.map((platform) => (
              <span
                key={platform}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sentri-blue/10 text-sentri-blue"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ul className="mt-2.5 space-y-1">
        {info.features.map((feature) => (
          <li key={feature} className="flex items-center gap-1.5 text-xs text-gray-600">
            <svg className="w-3.5 h-3.5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Add Business Modal
interface AddBusinessModalProps {
  onClose: () => void
  onSubmit: (input: CreateBusinessInput) => Promise<void>
}

function AddBusinessModal({ onClose, onSubmit }: AddBusinessModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    businessType: 'OTHER' as BusinessType,
    plan: 'STARTER' as const,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-guardian-navy">Add Business</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue"
              placeholder="Joe's Pizza"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <select
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value as BusinessType })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue bg-white"
            >
              {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue"
              placeholder="owner@business.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue"
              placeholder="Min 8 chars, upper, lower, number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value as typeof form.plan })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue bg-white"
            >
              <option value="STARTER">Starter — $49/mo</option>
              <option value="PROFESSIONAL">Professional — $99/mo</option>
              <option value="ENTERPRISE">Enterprise — $199/mo</option>
            </select>
            <PlanDescription plan={form.plan} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Business'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Business Detail Modal
interface BusinessDetailModalProps {
  business: BusinessDetails
  loading: boolean
  onClose: () => void
  onSave: (id: string, customInstructions: string) => Promise<void>
}

function BusinessDetailModal({ business, loading, onClose, onSave }: BusinessDetailModalProps) {
  const [instructions, setInstructions] = useState(business.customInstructions || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(business.id, instructions)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const totalReviews = Object.values(business.reviewStats || {}).reduce((a, b) => a + b, 0)
  const respondedReviews = business.reviewStats?.RESPONDED || 0
  const responseRate = totalReviews > 0 ? Math.round((respondedReviews / totalReviews) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-guardian-navy">{business.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                <p className="text-gray-900">{business.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Type</label>
                <p className="text-gray-900">{BUSINESS_TYPE_LABELS[business.businessType]}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Plan</label>
                <p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    business.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                    business.plan === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {business.plan}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Total Reviews</label>
                <p className="text-gray-900 font-medium">{totalReviews}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Response Rate</label>
                <p className="text-gray-900 font-medium">{responseRate}%</p>
              </div>
            </div>

            {/* AI Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Instructions <span className="text-gray-400">(admin only)</span>
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue resize-none"
                placeholder="Add custom instructions for AI responses (e.g., &quot;This is an upscale restaurant. Emphasize fine dining experience. Never mention competitors.&quot;)"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                These instructions are injected into the AI prompt. The business cannot see them.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">Saved!</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
