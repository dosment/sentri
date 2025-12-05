import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { QrCodeIcon, ClipboardIcon, CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface QRCodeGeneratorProps {
  googleReviewUrl: string | null
  onUpdateUrl: (url: string) => Promise<void>
}

export function QRCodeGenerator({ googleReviewUrl, onUpdateUrl }: QRCodeGeneratorProps) {
  const [url, setUrl] = useState(googleReviewUrl || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setUrl(googleReviewUrl || '')
  }, [googleReviewUrl])

  const validateGoogleUrl = (input: string): boolean => {
    if (!input) return true
    const patterns = [
      /^https:\/\/(www\.)?google\.com\/maps/,
      /^https:\/\/g\.page/,
      /^https:\/\/search\.google\.com\/local/,
    ]
    return patterns.some(pattern => pattern.test(input))
  }

  const handleSave = async () => {
    if (!validateGoogleUrl(url)) {
      setError('Please enter a valid Google review URL')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onUpdateUrl(url)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleCopyLink = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadQR = () => {
    if (!url) return
    // Use Google Charts API to generate QR code
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=${encodeURIComponent(url)}&choe=UTF-8`

    // Create a link and download
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = 'review-qr-code.png'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const qrCodeImageUrl = url
    ? `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(url)}&choe=UTF-8`
    : null

  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-sentri-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <QrCodeIcon className="w-5 h-5 text-sentri-blue" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-guardian-navy">
            Review QR Code
          </h2>
          <p className="text-sm text-gray-600">
            Generate a QR code that links directly to your Google review page.
          </p>
        </div>
      </div>

      {/* URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Review URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            setError('')
            setSaved(false)
          }}
          placeholder="https://g.page/r/your-business/review"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sentri-blue focus:border-sentri-blue transition-all"
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Find your review link in Google Business Profile under "Get more reviews"
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={handleSave} variant="secondary" disabled={saving}>
          {saving ? 'Saving...' : 'Save URL'}
        </Button>
        {saved && (
          <span className="text-sm text-success font-medium flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>

      {/* QR Code Preview */}
      {qrCodeImageUrl && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* QR Code Image */}
            <div className="flex-shrink-0">
              <div className="w-[200px] h-[200px] bg-white border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={qrCodeImageUrl}
                  alt="Google Review QR Code"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-medium text-guardian-navy mb-2">
                  Your Review QR Code
                </h3>
                <p className="text-sm text-gray-600">
                  Print this QR code and display it at your business. Customers can scan it to leave a Google review.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleDownloadQR} variant="primary" size="sm">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                <Button onClick={handleCopyLink} variant="secondary" size="sm">
                  {copied ? (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardIcon className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-guardian-navy mb-1">
                  Tips for getting more reviews
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>Place QR codes at checkout counters and tables</li>
                  <li>Add to receipts and business cards</li>
                  <li>Ask satisfied customers personally</li>
                  <li>Send follow-up emails with the review link</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!url && (
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center py-8">
            <QrCodeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Enter your Google review URL above to generate a QR code
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
