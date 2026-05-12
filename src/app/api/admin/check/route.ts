import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin/config';
import { ADMIN_BYPASS_COOKIE, isValidAdminBypassCookie } from '@/lib/admin/hardcoded-auth';

/**
 * GET /api/admin/check - Check if current user is an admin
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const hasAdminBypass = isValidAdminBypassCookie(
      request.cookies.get(ADMIN_BYPASS_COOKIE)?.value
    );
    if (hasAdminBypass) {
      return NextResponse.json({ isAdmin: true });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isAdmin: false });
    }

    const isAdmin = isAdminEmail(user.email);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false });
  }
}

