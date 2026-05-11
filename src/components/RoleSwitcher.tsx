'use client'

import { Search, Briefcase } from 'lucide-react'
import Cookies from 'js-cookie'
import { useState } from 'react'

export type UserRole = 'SEEKER' | 'FINDER'

const ACTIVE_ROLE_COOKIE = 'campusconnect_active_role'

interface RoleSwitcherProps {
  defaultRole?: UserRole
  className?: string
}

export function RoleSwitcher({ defaultRole = 'SEEKER', className = '' }: RoleSwitcherProps) {
  // Get initial role from cookie or default
  const savedRole = Cookies.get(ACTIVE_ROLE_COOKIE) as UserRole | undefined
  const [activeRole] = useState<UserRole>(savedRole || defaultRole)

  const handleRoleSwitch = (newRole: UserRole): void => {
    if (newRole !== activeRole) {
      // Clear existing cookie
      Cookies.remove(ACTIVE_ROLE_COOKIE)
      // Set new role in cookie
      Cookies.set(ACTIVE_ROLE_COOKIE, newRole, { expires: 30 })
      // Redirect to dashboard
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className={`flex items-center gap-2 glass-card p-1 rounded-full ${className}`}>
      <button
        onClick={() => handleRoleSwitch('SEEKER')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          activeRole === 'SEEKER' ? 'text-white shadow-sm' : ''
        }`}
        style={{
          background: activeRole === 'SEEKER' 
            ? '#1E3A8A' 
            : 'transparent',
          color: activeRole === 'SEEKER' ? 'white' : 'var(--foreground-muted)',
        }}
      >
        <Search className="h-3.5 w-3.5" />
        <span>Find Work</span>
      </button>
      <button
        onClick={() => handleRoleSwitch('FINDER')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          activeRole === 'FINDER' ? 'text-white shadow-sm' : ''
        }`}
        style={{
          background: activeRole === 'FINDER' 
            ? '#1E3A8A' 
            : 'transparent',
          color: activeRole === 'FINDER' ? 'white' : 'var(--foreground-muted)',
        }}
      >
        <Briefcase className="h-3.5 w-3.5" />
        <span>Post Jobs</span>
      </button>
    </div>
  )
}

