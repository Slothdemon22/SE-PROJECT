import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import ResumeTipsClient from './ResumeTipsClient'

export default async function ResumeTipsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:px-20">
        <ResumeTipsClient />
      </main>
    </div>
  )
}

