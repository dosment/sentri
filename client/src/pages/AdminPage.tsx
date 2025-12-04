import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  getDealers,
  getDealer,
  createDealer,
  updateDealer,
  type AdminDealer,
  type DealerDetails,
  type CreateDealerInput,
} from '@/api/admin'
import type { AdminUser } from '@/api/auth'
import {
  PlusIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'

interface AdminPageProps {
  admin: AdminUser
  onLogout: () => void
}

export function AdminPage({ admin, onLogout }: AdminPageProps) {
  const [dealers, setDealers] = useState<AdminDealer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<DealerDetails | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    loadDealers()
  }, [])

  async function loadDealers() {
    try {
      const data = await getDealers()
      setDealers(data)
    } catch (error) {
      console.error('Failed to load dealers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleViewDealer(id: string) {
    setDetailLoading(true)
    try {
      const data = await getDealer(id)
      setSelectedDealer(data)
    } catch (error) {
      console.error('Failed to load dealer:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  async function handleCreateDealer(input: CreateDealerInput) {
    await createDealer(input)
    setShowAddModal(false)
    loadDealers()
  }

  async function handleUpdateDealer(id: string, customInstructions: string) {
    await updateDealer(id, { customInstructions })
    if (selectedDealer) {
      setSelectedDealer({ ...selectedDealer, customInstructions })
    }
    loadDealers()
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
          <h1 className="text-2xl font-bold text-guardian-navy">Dealers</h1>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Dealer
          </Button>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading dealers...</div>
          ) : dealers.length === 0 ? (
            <div className="p-8 text-center">
              <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No dealers yet</p>
              <Button onClick={() => setShowAddModal(true)} className="mt-4">
                Add your first dealer
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
                {dealers.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sentri-blue/10 rounded-full flex items-center justify-center">
                          <span className="text-sentri-blue font-medium text-sm">
                            {d.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-guardian-navy">{d.name}</div>
                          {d.isAdmin && (
                            <span className="text-xs text-sentri-blue font-medium">Admin</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {d.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        d.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                        d.plan === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {d.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {d._count.reviews}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDealer(d.id)}
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

      {/* Add Dealer Modal */}
      {showAddModal && (
        <AddDealerModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateDealer}
        />
      )}

      {/* Dealer Detail Modal */}
      {selectedDealer && (
        <DealerDetailModal
          dealer={selectedDealer}
          loading={detailLoading}
          onClose={() => setSelectedDealer(null)}
          onSave={handleUpdateDealer}
        />
      )}
    </div>
  )
}

// Add Dealer Modal
interface AddDealerModalProps {
  onClose: () => void
  onSubmit: (input: CreateDealerInput) => Promise<void>
}

function AddDealerModal({ onClose, onSubmit }: AddDealerModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    plan: 'STARTER' as const,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dealer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-guardian-navy">Add Dealer</h2>
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
              Dealership Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue"
              placeholder="Westside Honda"
            />
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
              placeholder="manager@dealership.com"
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
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Dealer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Dealer Detail Modal
interface DealerDetailModalProps {
  dealer: DealerDetails
  loading: boolean
  onClose: () => void
  onSave: (id: string, customInstructions: string) => Promise<void>
}

function DealerDetailModal({ dealer, loading, onClose, onSave }: DealerDetailModalProps) {
  const [instructions, setInstructions] = useState(dealer.customInstructions || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(dealer.id, instructions)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const totalReviews = Object.values(dealer.reviewStats || {}).reduce((a, b) => a + b, 0)
  const respondedReviews = dealer.reviewStats?.RESPONDED || 0
  const responseRate = totalReviews > 0 ? Math.round((respondedReviews / totalReviews) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-guardian-navy">{dealer.name}</h2>
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
                <p className="text-gray-900">{dealer.email}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Plan</label>
                <p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dealer.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                    dealer.plan === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {dealer.plan}
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
                placeholder="Add custom instructions for AI responses (e.g., &quot;This is a luxury dealer. Emphasize premium service. Never mention competitors.&quot;)"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                These instructions are injected into the AI prompt. The dealer cannot see them.
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
