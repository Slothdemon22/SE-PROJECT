'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isAdminEmail } from '@/lib/admin/config'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const hardcodedAdminRes = await fetch('/api/admin/hardcoded-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (hardcodedAdminRes.ok) {
        router.push('/admin')
        router.refresh()
        return
      }

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Check if user is admin and redirect accordingly
        if (authData.user && isAdminEmail(authData.user.email)) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tight">Welcome <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Back</span></h2>
        <p className="mt-3 text-slate-400 font-medium">
          New to the platform?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline-offset-4 hover:underline">
            Create an account
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
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/forgot-password" size="sm" className="text-[10px] font-black text-slate-600 hover:text-blue-400 uppercase tracking-widest transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-white/5 text-white rounded-2xl h-12 px-5 pr-12 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                <span>Authenticating...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}


