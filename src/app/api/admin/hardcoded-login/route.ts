import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_BYPASS_COOKIE,
  getAdminBypassCookieValue,
  isHardcodedAdminCredentials,
} from '@/lib/admin/hardcoded-auth'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as { email?: string; password?: string }
    const email = body.email || ''
    const password = body.password || ''

    if (!isHardcodedAdminCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_BYPASS_COOKIE, getAdminBypassCookieValue(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }
}
