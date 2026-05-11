import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Mail, GraduationCap, Briefcase, User as UserIcon } from 'lucide-react'
import ProfileRatingClient from './ProfileRatingClient'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    redirect('/create-profile')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                Your Profile
              </h1>
              <p className="mt-2 text-lg text-slate-400">
                Manage your account information and AI analysis
              </p>
            </div>
            <Link href="/profile/edit">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl space-y-8 relative overflow-hidden z-10 w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName || 'User'}
                  className="h-28 w-28 rounded-3xl object-cover border-4 border-slate-800 shadow-xl"
                />
              ) : (
                <div
                  className="h-28 w-28 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)' }}
                >
                  {profile.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile.fullName || 'No Name Set'}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-slate-400">
                  <span className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {profile.email || user.email}
                  </span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                    Member since {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 text-sm font-medium">
                    <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                    {profile.role === 'SEEKER' ? 'Talent Seeker' : 'Talent Finder'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 space-y-6 relative z-10">
              {/* Bio */}
              {profile.bio && (
                <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                  <label className="text-sm font-bold text-white mb-3 block">
                    About Me
                  </label>
                  <p className="text-slate-300 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Department & Year Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {profile.department && (
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                    <label className="text-sm font-bold flex items-center gap-2 text-white mb-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      Department
                    </label>
                    <p className="text-slate-300 font-medium">
                      {profile.department}
                    </p>
                  </div>
                )}
                {profile.year && (
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                    <label className="text-sm font-bold flex items-center gap-2 text-white mb-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      Year
                    </label>
                    <p className="text-slate-300 font-medium">
                      {profile.year}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <label className="text-sm font-bold text-white mb-3 block">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-slate-950/50 border-white/10 text-slate-300 px-3 py-1.5"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <label className="text-sm font-bold text-white mb-3 block">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-indigo-500/10 border-indigo-500/20 text-indigo-300 px-3 py-1.5"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Profile Rating Section */}
          <ProfileRatingClient userId={user.id} />
        </div>
      </main>
    </div>
  )
}
