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
    <div className={`flex items-center gap-1.5 p-1.5 bg-slate-900/60 border border-white/5 backdrop-blur-md rounded-full shadow-inner ${className}`}>
      <button
        onClick={() => handleRoleSwitch('SEEKER')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          activeRole === 'SEEKER' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }`}
      >
        <Search className="h-3.5 w-3.5" strokeWidth={3} />
        <span>Find Work</span>
      </button>
      <button
        onClick={() => handleRoleSwitch('FINDER')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          activeRole === 'FINDER' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
        }`}
      >
        <Briefcase className="h-3.5 w-3.5" strokeWidth={3} />
        <span>Post Jobs</span>
      </button>
    </div>
  )
}

