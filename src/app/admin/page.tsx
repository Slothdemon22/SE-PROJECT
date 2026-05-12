import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/Navbar'
import { AdminDashboard } from './AdminDashboard'
import { isAdminEmail } from '@/lib/admin/config'
import {
  ADMIN_BYPASS_COOKIE,
  isValidAdminBypassCookie,
} from '@/lib/admin/hardcoded-auth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const hasAdminBypass = isValidAdminBypassCookie(
    cookieStore.get(ADMIN_BYPASS_COOKIE)?.value
  )

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !hasAdminBypass) {
    redirect('/login')
  }

  // Check if user is admin using hardcoded email list
  if (!hasAdminBypass && !isAdminEmail(user?.email)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navbar />
      <AdminDashboard userId={user?.id || 'hardcoded-admin'} />
    </div>
  )
}



