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

      <main className="mx-auto max-w-[1800px] px-6 py-20 md:px-12 lg:px-20">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/5">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
                Executive Profile
              </h1>
              <p className="text-xl text-slate-400 font-medium">
                Manage your digital presence and professional strategic assets.
              </p>
            </div>
            <Link href="/profile/edit">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center gap-3">
                <Edit className="w-5 h-5" />
                Edit Profile
              </button>
            </Link>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-12 rounded-[3rem] shadow-2xl space-y-12 relative overflow-hidden z-10 w-full">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'User'}
                    className="h-48 w-48 rounded-[3rem] object-cover border-4 border-slate-800 shadow-2xl relative z-10"
                  />
                ) : (
                  <div
                    className="h-48 w-48 rounded-[3rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl relative z-10"
                    style={{ background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)' }}
                  >
                    {profile.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center lg:text-left space-y-6">
                <div>
                  <h2 className="text-5xl font-black text-white mb-3">
                    {profile.fullName || 'Unidentified Talent'}
                  </h2>
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-slate-400 font-medium">
                    <span className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400/60" />
                      {profile.email || user.email}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden lg:block" />
                    <span className="text-sm uppercase tracking-widest font-black text-slate-500">
                      Member since {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {profile.role === 'SEEKER' ? 'Strategic Seeker' : 'Talent Finder'}
                  </Badge>
                  {profile.department && (
                    <Badge className="bg-slate-800/50 text-slate-300 border border-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {profile.department}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-white/5 relative z-10">
              {/* Left Column: Bio & Academics */}
              <div className="lg:col-span-7 space-y-10">
                {profile.bio && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Professional Narrative</h3>
                    <div className="bg-slate-950/40 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                      <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
                        "{profile.bio}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-6">
                  {profile.department && (
                    <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-white/5">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        Academic Focus
                      </h4>
                      <p className="text-lg text-white font-bold">
                        {profile.department}
                      </p>
                    </div>
                  )}
                  {profile.year && (
                    <div className="bg-slate-950/40 p-8 rounded-[2rem] border border-white/5">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        Seniority Level
                      </h4>
                      <p className="text-lg text-white font-bold">
                        Year {profile.year}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Skills & Interests */}
              <div className="lg:col-span-5 space-y-10">
                {profile.skills && profile.skills.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Core Proficiencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-blue-500/5 border border-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Strategic Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <div
                          key={index}
                          className="bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                          {interest}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Profile Rating Section */}
          <div className="pt-8">
            <ProfileRatingClient userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
