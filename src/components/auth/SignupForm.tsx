'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to sign up')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl rounded-3xl text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Welcome Aboard!</h2>
          <p className="text-emerald-400/80 font-medium">
            Account created successfully. Synchronizing your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tight">Join the <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Elite</span></h2>
        <p className="mt-3 text-slate-400 font-medium">
          Already a member?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="p-8 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <p className="text-sm text-red-400 font-bold text-center">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full bg-slate-950/50 border border-white/5 text-white rounded-2xl h-12 px-5 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-white/5 text-white rounded-2xl h-12 px-5 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/50 border border-white/5 text-white rounded-2xl h-12 px-5 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-14 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
      
      <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest px-8 leading-relaxed">
        By creating an account, you agree to our <br/>
        <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
      </p>
    </div>
  )
}


