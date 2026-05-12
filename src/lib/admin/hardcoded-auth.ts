import { ADMIN_CREDENTIALS } from '@/lib/admin/config'

export const ADMIN_BYPASS_COOKIE = 'campusconnect_admin_bypass'

function getConfiguredAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || ADMIN_CREDENTIALS.email || '').trim().toLowerCase()
}

function getConfiguredAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || ADMIN_CREDENTIALS.password || '').trim()
}

function getBypassToken(): string {
  const configured = (process.env.ADMIN_BYPASS_TOKEN || '').trim()
  if (configured) return configured

  // Local-dev fallback token when ADMIN_BYPASS_TOKEN is not set.
  return `${getConfiguredAdminEmail()}::${getConfiguredAdminPassword()}::admin-bypass`
}

export function isHardcodedAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === getConfiguredAdminEmail() &&
    password === getConfiguredAdminPassword()
  )
}

export function isValidAdminBypassCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  return cookieValue === getBypassToken()
}

export function getAdminBypassCookieValue(): string {
  return getBypassToken()
}
