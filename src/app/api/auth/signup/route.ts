import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSignupConfirmationEmail } from '@/lib/email/service'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const adminAuthClient = createAdminClient().auth.admin

    // Use the admin client to generate a signup link.
    // This creates the user (if they don't exist) and generates an email confirmation link
    // WITHOUT sending the rate-limited Supabase default email.
    const { data, error } = await adminAuthClient.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error generating signup link:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data && data.properties && data.properties.action_link) {
      const userName = email.split('@')[0]
      // Use Resend to send the confirmation email
      const emailResult = await sendSignupConfirmationEmail(
        email,
        userName,
        data.properties.action_link
      )
      
      if (!emailResult.success) {
         console.error('Failed to send confirmation email:', emailResult.error)
         // Even if email fails, user is created, but they can't log in without verification.
         // You might want to handle this gracefully.
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Unexpected error during signup:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred during signup' },
      { status: 500 }
    )
  }
}
