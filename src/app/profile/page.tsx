import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Edit, Mail, GraduationCap, User as UserIcon } from 'lucide-react'
import ProfileRatingClient from './ProfileRatingClient'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    redirect('/create-profile')
  }

  const profileChecks = [
    { label: 'Full name', complete: Boolean(profile.fullName?.trim()) },
    { label: 'Bio', complete: Boolean(profile.bio?.trim()) },
    { label: 'Department', complete: Boolean(profile.department?.trim()) },
    { label: 'Year', complete: Boolean(profile.year?.trim()) },
    { label: 'Skills', complete: Boolean(profile.skills?.length) },
    { label: 'Interests', complete: Boolean(profile.interests?.length) },
    { label: 'Avatar', complete: Boolean(profile.avatarUrl?.trim()) },
  ]
  const completedChecks = profileChecks.filter((item) => item.complete).length
  const profileCompleteness = Math.round((completedChecks / profileChecks.length) * 100)
  const missingItems = profileChecks.filter((item) => !item.complete).map((item) => item.label)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="page-shell space-y-6">
        <section className="surface-card p-6 md:p-8">
          <div className="section-header">
            <div>
              <h1 className="section-title">Profile</h1>
              <p className="section-subtitle">Keep your identity, strengths, and interests up to date.</p>
            </div>
            <Link href="/profile/edit" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 surface-card-muted p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'User'}
                    className="h-20 w-20 rounded-xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-slate-800 flex items-center justify-center text-white text-2xl font-bold border border-white/10">
                    {profile.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">{profile.fullName || 'Add your name'}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email || user.email}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-600/15 text-blue-300 border border-blue-500/30">
                      <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                      {profile.role === 'SEEKER' ? 'Talent Seeker' : 'Talent Finder'}
                    </Badge>
                    {profile.department && (
                      <Badge className="bg-white/5 text-slate-300 border border-white/10">
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                        {profile.department}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <div className="surface-kpi">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Academic Year</p>
                  <p className="text-lg font-semibold text-white mt-1">{profile.year || 'Not set'}</p>
                </div>
                <div className="surface-kpi">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Member Since</p>
                  <p className="text-lg font-semibold text-white mt-1">
                    {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-white mb-2">Bio</h3>
                <p className="text-sm leading-6 text-slate-300">
                  {profile.bio || 'No bio added yet.'}
                </p>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="surface-card-muted p-5">
                <p className="text-sm font-semibold text-white">Profile Completeness</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{profileCompleteness}%</p>
                <p className="text-xs text-slate-400 mt-1">
                  {profileCompleteness >= 85 ? 'Your profile is in great shape.' : 'Complete missing fields for better recommendations.'}
                </p>
              </div>
              {missingItems.length > 0 && (
                <div className="surface-card-muted p-5">
                  <p className="text-sm font-semibold text-white mb-2">Missing Items</p>
                  <div className="flex flex-wrap gap-2">
                    {missingItems.map((item) => (
                      <span key={item} className="text-xs px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="surface-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length ? profile.skills.map((skill, index) => (
                  <span key={index} className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    {skill}
                  </span>
                )) : <p className="text-sm text-slate-400">No skills added yet.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.length ? profile.interests.map((interest, index) => (
                  <span key={index} className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    {interest}
                  </span>
                )) : <p className="text-sm text-slate-400">No interests added yet.</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card p-6 md:p-8">
          <ProfileRatingClient />
        </section>
      </main>
    </div>
  )
}
