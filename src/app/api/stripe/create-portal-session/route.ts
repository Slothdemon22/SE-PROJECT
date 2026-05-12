import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { StripeService } from '@/lib/stripe/service'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    const stripeCustomerId =
      (dbUser as { stripeCustomerId?: string | null } | null)?.stripeCustomerId ?? null

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    const { getAppUrl } = await import('@/lib/utils/url')
    const appUrl = getAppUrl(request)

    const session = await StripeService.createPortalSession(
      stripeCustomerId,
      `${appUrl}/billing`
    )

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}





