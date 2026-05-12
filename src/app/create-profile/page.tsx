import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreateProfileForm } from './CreateProfileForm';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/admin/config';

export default async function CreateProfilePage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Admins don't need a profile - redirect to admin dashboard
  if (isAdminEmail(user.email)) {
    redirect('/admin');
  }

  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id }
  });

  if (existingProfile) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="page-shell max-w-5xl">
        <div className="surface-card p-6 md:p-8">
          <CreateProfileForm user={user} />
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">
          Your information is secure and only shown where relevant.
        </p>
      </main>
    </div>
  );
}

