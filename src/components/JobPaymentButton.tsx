'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreditCard, Loader2, DollarSign, X, Sparkles, BadgeCheck } from 'lucide-react'

interface JobPaymentButtonProps {
  jobId: string
  currentPaymentAmount?: number | null
  isPaid: boolean
  className?: string
}

export function JobPaymentButton({ 
  jobId, 
  currentPaymentAmount,
  isPaid,
  className = '' 
}: JobPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(currentPaymentAmount?.toString() || '50')
  const [error, setError] = useState('')
  const presetAmounts = [5, 10, 20, 50]

  if (isPaid) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800">
        <CreditCard className="w-4 h-4" />
        <span className="font-medium">Paid: ${currentPaymentAmount}</span>
      </div>
    )
  }

  const handlePayment = async () => {
    setError('')
    const amount = parseFloat(paymentAmount)

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (amount < 5) {
      setError('Minimum payment amount is $5')
      return
    }

    if (amount > 10000) {
      setError('Maximum payment amount is $10,000')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/jobs/${jobId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentAmount: amount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setIsLoading(false)
    }
  }

  const handleAmountChange = (value: string) => {
    const normalized = value.replace(/[^\d.]/g, '')
    setPaymentAmount(normalized)
    if (error) setError('')
  }

  if (!showPaymentForm) {
    return (
      <Button
        onClick={() => setShowPaymentForm(true)}
        className={`btn-gradient ${className}`}
      >
        <DollarSign className="w-4 h-4 mr-2" />
        Add Payment for Visibility
      </Button>
    )
  }

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Sparkles className="w-4 h-4 text-blue-500" />
            Boost Your Job Visibility
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>
            Promote this opportunity with Stripe-secured visibility boost.
          </p>
        </div>
        <button
          onClick={() => setShowPaymentForm(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
        <div className="flex items-start gap-2 text-sm text-blue-200">
          <BadgeCheck className="w-4 h-4 mt-0.5 text-blue-300" />
          <p>
            Visibility boost helps your posting stand out in listing cards and increase applicant trust.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Compensation Amount (USD)
        </label>
        <div className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
          <div className="flex h-10 items-center gap-1 border-r border-white/10 px-3 text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium">USD</span>
          </div>
          <Input
            type="text"
            inputMode="decimal"
            min="5"
            max="10000"
            step="10"
            value={paymentAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="h-10 border-0 bg-transparent pl-3 text-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter amount"
            disabled={isLoading}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setPaymentAmount(String(amount))}
              disabled={isLoading}
              className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
            >
              ${amount}
            </button>
          ))}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>
          Minimum: $5 • Maximum: $10,000
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Why add payment?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Show compensation amount prominently on listings</li>
              <li>Attract more qualified candidates</li>
              <li>Stand out from free listings</li>
              <li>Demonstrate commitment to the role</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">
        Estimated highlight label: <span className="font-semibold">${paymentAmount || '0'} visibility boost</span>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="btn-gradient flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${paymentAmount}
            </>
          )}
        </Button>
        <Button
          onClick={() => setShowPaymentForm(false)}
          variant="outline"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>

      <p className="text-xs text-center" style={{ color: 'var(--foreground-muted)' }}>
        Secure payment powered by Stripe
      </p>
    </div>
  )
}

