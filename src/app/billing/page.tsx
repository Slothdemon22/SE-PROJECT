import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { BillingClient } from './BillingClient'

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <BillingClient
        userId={user.id}
        email={user.email!}
        subscription={null}
        invoices={[]}
        stripeCustomerId={null}
      />
    </div>
  )
}





