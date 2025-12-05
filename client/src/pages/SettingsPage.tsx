import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { QRCodeGenerator } from '@/components/settings/QRCodeGenerator'
import { getReviewStats, type ReviewStats } from '@/api/reviews'
import { getSettings, updateSettings, type BusinessSettings, type ResponseTone } from '@/api/settings'
import type { Business } from '@/api/auth'
import { CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface SettingsPageProps {
  business: Business
  onLogout: () => void
}

const TONE_OPTIONS: { value: ResponseTone; label: string; description: string }[] = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Warm but businesslike',
  },
  {
    value: 'neighborly',
    label: 'Neighborly',
    description: 'Personal and approachable',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and friendly',
  },
  {
    value: 'humorous',
    label: 'Humorous',
    description: 'Light and playful',
  },
]

const TITLE_OPTIONS = [
  'Owner',
  'General Manager',
  'Manager',
  'Director',
  'Customer Relations Manager',
]

function getSampleResponse(tone: ResponseTone, businessName: string): string {
  const responses: Record<ResponseTone, string> = {
    professional: `Thank you for your feedback about your visit to ${businessName}. We're committed to providing excellent service, and we appreciate you letting us know about your experience. Please don't hesitate to reach out if there's anything more we can do.`,
    neighborly: `Thanks so much for sharing your experience with us at ${businessName}! We really appreciate you taking the time — it means a lot to our team. If there's anything else we can help with, just give us a call. We're always here for you!`,
    casual: `Hey, thanks for the feedback about ${businessName}! We appreciate you taking a moment to share. Let us know if there's anything we can do better next time!`,
    humorous: `Well, we aim to please at ${businessName} — even if sometimes we miss by a mile! Thanks for the honest feedback. We promise our coffee is better than our timing. Swing by again and we'll make it right!`,
  }
  return responses[tone]
}

export function SettingsPage({ business, onLogout }: SettingsPageProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [useCustomTitle, setUseCustomTitle] = useState(false)
  const [showNegativeInfo, setShowNegativeInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getReviewStats().catch(() => null),
      getSettings().catch((err) => {
        console.error('Failed to load settings:', err)
        setError(err.message || 'Failed to load settings')
        return null
      }),
    ]).then(([statsData, settingsData]) => {
      setStats(statsData)
      if (settingsData) {
        setSettings(settingsData)
        // Check if current title is custom
        if (settingsData.signOffTitle && !TITLE_OPTIONS.includes(settingsData.signOffTitle)) {
          setCustomTitle(settingsData.signOffTitle)
          setUseCustomTitle(true)
        }
      }
      setLoading(false)
    })
  }, [])

  const newReviewCount = stats?.byStatus?.NEW || 0

  const handleToneChange = (tone: ResponseTone) => {
    if (!settings) return
    setSettings({ ...settings, responseTone: tone })
    setSaved(false)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return
    setSettings({ ...settings, signOffName: e.target.value || null })
    setSaved(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!settings) return
    const value = e.target.value
    if (value === '__custom__') {
      setUseCustomTitle(true)
      setSettings({ ...settings, signOffTitle: customTitle || null })
    } else {
      setUseCustomTitle(false)
      setSettings({ ...settings, signOffTitle: value })
    }
    setSaved(false)
  }

  const handleCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return
    setCustomTitle(e.target.value)
    setSettings({ ...settings, signOffTitle: e.target.value || null })
    setSaved(false)
  }

  const handleAutoPostChange = (enabled: boolean) => {
    if (!settings) return
    setSettings({ ...settings, autoPostEnabled: enabled })
    setSaved(false)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settings) return
    setSettings({ ...settings, phone: e.target.value || null })
    setSaved(false)
  }

  const handleHideOldReviewsChange = (enabled: boolean) => {
    if (!settings) return
    setSettings({ ...settings, hideOldReviews: enabled })
    setSaved(false)
  }

  const handleOldReviewThresholdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!settings) return
    setSettings({ ...settings, oldReviewThresholdDays: parseInt(e.target.value, 10) })
    setSaved(false)
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await updateSettings({
        autoPostEnabled: settings.autoPostEnabled,
        responseTone: settings.responseTone,
        signOffName: settings.signOffName,
        signOffTitle: settings.signOffTitle,
        phone: settings.phone,
        hideOldReviews: settings.hideOldReviews,
        oldReviewThresholdDays: settings.oldReviewThresholdDays,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppShell
        businessName={business.name}
        pageTitle="Settings"
        newReviewCount={0}
        onLogout={onLogout}
      >
        <div className="max-w-2xl">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-100 rounded-xl" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (error || !settings) {
    return (
      <AppShell
        businessName={business.name}
        pageTitle="Settings"
        newReviewCount={0}
        onLogout={onLogout}
      >
        <div className="max-w-2xl">
          <Card className="p-6">
            <p className="text-red-600">{error || 'Failed to load settings'}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="mt-4"
            >
              Retry
            </Button>
          </Card>
        </div>
      </AppShell>
    )
  }

  const sampleResponse = getSampleResponse(settings.responseTone as ResponseTone, business.name)
  const signOff = settings.signOffName && settings.signOffTitle
    ? `${settings.signOffName}, ${settings.signOffTitle}`
    : settings.signOffName || ''

  return (
    <AppShell
      businessName={business.name}
      pageTitle="Settings"
      newReviewCount={newReviewCount}
      onLogout={onLogout}
    >
      <div className="max-w-2xl space-y-6">
        {/* Response Automation Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-guardian-navy mb-1">
            Response Automation
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Choose how Sentri handles your review responses.
          </p>

          <div className="space-y-3">
            {/* Manual approval option */}
            <label className={`
              block p-4 rounded-lg border-2 cursor-pointer transition-all
              ${!settings.autoPostEnabled
                ? 'border-sentri-blue bg-sentri-blue/5'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="autoPost"
                  checked={!settings.autoPostEnabled}
                  onChange={() => handleAutoPostChange(false)}
                  className="mt-1 h-4 w-4 text-sentri-blue focus:ring-sentri-blue"
                />
                <div>
                  <div className="font-medium text-guardian-navy">
                    I'll approve each response
                  </div>
                  <div className="text-sm text-gray-500">
                    All AI responses wait for your approval before posting
                  </div>
                </div>
              </div>
            </label>

            {/* Auto-post option */}
            <label className={`
              block p-4 rounded-lg border-2 cursor-pointer transition-all
              ${settings.autoPostEnabled
                ? 'border-sentri-blue bg-sentri-blue/5'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="autoPost"
                  checked={settings.autoPostEnabled}
                  onChange={() => handleAutoPostChange(true)}
                  className="mt-1 h-4 w-4 text-sentri-blue focus:ring-sentri-blue"
                />
                <div>
                  <div className="font-medium text-guardian-navy">
                    Let Sentri handle it
                  </div>
                  <div className="text-sm text-gray-500">
                    Positive reviews (4-5 stars) post automatically.
                    <br />
                    Negative reviews still need your approval.
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* What counts as negative - expandable */}
          {settings.autoPostEnabled && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowNegativeInfo(!showNegativeInfo)}
                className="text-sm text-sentri-blue hover:underline flex items-center gap-1"
              >
                <InformationCircleIcon className="w-4 h-4" />
                What counts as negative?
              </button>

              {showNegativeInfo && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-2">These always need your approval:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>1-3 star reviews</li>
                    <li>Reviews mentioning complaints or problems</li>
                    <li>Reviews with concerning language</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* How Sentri handles negatives - info box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-guardian-navy mb-2">
              How Sentri handles negative reviews
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-success flex-shrink-0" />
                More empathetic, solution-focused tone
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-success flex-shrink-0" />
                Always requires your approval
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-success flex-shrink-0" />
                Flagged "Needs Attention" in dashboard
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              This happens automatically — no configuration needed.
            </p>
          </div>
        </Card>

        {/* Contact Information Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-guardian-navy mb-1">
            Contact Information
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Used in responses to negative reviews so customers can reach you directly.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone
              </label>
              <input
                type="tel"
                value={settings.phone || ''}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue transition-all duration-small"
              />
              <p className="text-xs text-gray-500 mt-2">
                This number will be included in responses to negative reviews for offline follow-up.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Email
              </label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {business.email}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your account email is used for customer follow-up in negative review responses.
              </p>
            </div>
          </div>
        </Card>

        {/* Response Style Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-guardian-navy mb-1">
            Response Style
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Customize how AI-generated responses sound for {business.name}.
          </p>

          {/* Tone Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tone
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToneChange(option.value)}
                  className={`
                    relative p-4 rounded-lg border-2 text-left transition-all duration-small
                    ${settings.responseTone === option.value
                      ? 'border-sentri-blue bg-sentri-blue/5'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  {settings.responseTone === option.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-sentri-blue rounded-full flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="font-medium text-guardian-navy">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sign-off Fields */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sign-off
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={settings.signOffName || ''}
                  onChange={handleNameChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue transition-all duration-small"
                />
              </div>
              <div>
                <select
                  value={useCustomTitle ? '__custom__' : (settings.signOffTitle || 'Owner')}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue transition-all duration-small bg-white"
                >
                  {TITLE_OPTIONS.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                  <option value="__custom__">Custom title...</option>
                </select>
              </div>
            </div>
            {useCustomTitle && (
              <input
                type="text"
                value={customTitle}
                onChange={handleCustomTitleChange}
                placeholder="Enter custom title"
                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue transition-all duration-small"
              />
            )}
            <p className="text-xs text-gray-500 mt-2">
              Responses with a personal sign-off see 2× higher customer return rates.
            </p>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Sample Review</p>
                  <p className="text-sm text-gray-700">
                    "Service took longer than expected, had to wait almost 3 hours..."
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="text-xs text-gray-500 font-medium mb-1">AI Response</p>
                <p className="text-sm text-gray-700">
                  {sampleResponse}
                  {signOff && (
                    <>
                      <br /><br />
                      <span className="font-medium">{signOff}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Review Display Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-guardian-navy mb-1">
            Review Display
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Control which reviews appear in your dashboard.
          </p>

          <div className="space-y-4">
            {/* Hide old reviews toggle */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hideOldReviews}
                onChange={(e) => handleHideOldReviewsChange(e.target.checked)}
                className="mt-1 h-4 w-4 text-sentri-blue focus:ring-sentri-blue rounded"
              />
              <div>
                <div className="font-medium text-guardian-navy">
                  Hide old reviews
                </div>
                <div className="text-sm text-gray-500">
                  Only show recent reviews in your dashboard to focus on what matters now.
                </div>
              </div>
            </label>

            {/* Threshold selector - only show when hiding is enabled */}
            {settings.hideOldReviews && (
              <div className="ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show reviews from the last
                </label>
                <select
                  value={settings.oldReviewThresholdDays}
                  onChange={handleOldReviewThresholdChange}
                  className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue transition-all duration-small bg-white"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>6 months</option>
                  <option value={365}>1 year</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Reviews older than this will be hidden from your dashboard.
                  You can still view all reviews by using the filter options.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* QR Code Generator */}
        <QRCodeGenerator
          googleReviewUrl={settings.googleReviewUrl}
          onUpdateUrl={async (url) => {
            try {
              await updateSettings({ googleReviewUrl: url })
              setSettings({ ...settings, googleReviewUrl: url })
            } catch (err) {
              console.error('Failed to update Google review URL:', err)
            }
          }}
        />

        {/* Save Button - sticky at bottom */}
        <div className="sticky bottom-4 flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
          <Button onClick={handleSave} variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          {saved && (
            <span className="text-sm text-success font-medium flex items-center gap-1">
              <CheckIcon className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>
      </div>
    </AppShell>
  )
}
