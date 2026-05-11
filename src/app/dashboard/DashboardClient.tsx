'use client'

import { useActiveRole } from '@/hooks/useActiveRole'
import { Search, Briefcase, Plus, Users, BookmarkIcon, TrendingUp, Clock, CheckCircle, XCircle, Sparkles, Eye, MousePointerClick, Percent, BarChart3, ArrowRight, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AIJobRecommendations from '@/components/AIJobRecommendations'
import gsap from 'gsap'

interface AnalyticsData {
  seeker: {
    applicationsSent: number;
    savedJobs: number;
    profileViews: number;
    applicationsByStatus: {
      pending: number;
      reviewing: number;
      accepted: number;
      rejected: number;
    };
  };
  finder: {
    activeJobs: number;
    draftJobs: number;
    pendingJobs: number;
    applicationsReceived: number;
    totalViews: number;
    totalBookmarks: number;
    averageApplicationRate: string;
    recentJobs: Array<{
      id: string;
      title: string;
      jobType: string;
      status: string;
      views: number;
      createdAt: string;
      updatedAt: string;
      location: string;
      company: string;
      applicationRate: number;
      bookmarkRate: number;
      _count: {
        applications: number;
        bookmarks: number;
      };
    }>;
  };
}

interface DashboardClientProps {
  profile: {
    id: string
    fullName: string | null
    avatarUrl: string | null
    department: string | null
    role: string
    skills: string[]
    interests: string[]
  }
  serverActiveRole?: 'SEEKER' | 'FINDER'
}

export function DashboardClient({ profile, serverActiveRole }: DashboardClientProps) {
  const { activeRole, isLoading } = useActiveRole(serverActiveRole || profile.role as 'SEEKER' | 'FINDER')
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async (): Promise<void> => {
      try {
        const response = await fetch('/api/dashboard/analytics')
        if (response.ok) {
          const data: AnalyticsData = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoadingAnalytics(false)
      }
    }

    fetchAnalytics()
  }, [])

  // GSAP Animations
  useEffect(() => {
    if (!loadingAnalytics && !isLoading && containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.bento-item')
      gsap.fromTo(elements, 
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      )
    }
  }, [loadingAnalytics, isLoading, activeRole])

  if (isLoading || loadingAnalytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 rounded-3xl" ref={containerRef}>
      
      {/* Dynamic Header */}
      <div className="bento-item flex flex-col md:flex-row items-center justify-between bg-slate-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Profile" className="w-20 h-20 rounded-2xl object-cover shadow-lg border border-white/10" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-3xl font-black text-white shadow-lg border border-white/20">
                {profile.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-slate-900 p-1.5 rounded-xl border border-white/10">
              {activeRole === 'SEEKER' ? <Search className="w-4 h-4 text-sky-400" /> : <Briefcase className="w-4 h-4 text-blue-400" />}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">
              Welcome back, {profile.fullName?.split(' ')[0]}
            </h1>
            <p className="text-slate-400 font-medium">
              {activeRole === 'SEEKER' ? 'Ready to find your next great role?' : 'Managing your open opportunities.'}
            </p>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 relative z-10">
          <Link href="/profile" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" /> Edit Profile
          </Link>
        </div>
      </div>

      {activeRole === 'SEEKER' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main KPI Bento Box */}
          <div className="bento-item md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-400">Applications</p>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><TrendingUp className="w-5 h-5"/></div>
              </div>
              <p className="text-4xl font-black text-white">{analytics.seeker.applicationsSent}</p>
            </div>
            
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-sky-500/20 hover:border-sky-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-400">Saved Jobs</p>
                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl group-hover:scale-110 transition-transform"><BookmarkIcon className="w-5 h-5"/></div>
              </div>
              <p className="text-4xl font-black text-white">{analytics.seeker.savedJobs}</p>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-400">Profile Views</p>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform"><Eye className="w-5 h-5"/></div>
              </div>
              <p className="text-4xl font-black text-white">{analytics.seeker.profileViews}</p>
            </div>
          </div>

          {/* Call to Action Box */}
          <div className="bento-item md:col-span-4 bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-blue-500/20 border border-blue-500/30">
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 text-white/80 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Find Opportunities</h3>
              <p className="text-blue-100/80 mb-6">Explore the latest positions tailored precisely for your skills.</p>
            </div>
            <Link href="/jobs" className="relative z-10 w-full py-4 bg-white text-blue-950 font-black rounded-2xl text-center hover:scale-[1.02] transition-transform">
              Explore Jobs
            </Link>
          </div>

          {/* Application Status Breakdowns */}
          <div className="bento-item md:col-span-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6">Application Status Pipeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Pending', count: analytics.seeker.applicationsByStatus.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
                { label: 'Reviewing', count: analytics.seeker.applicationsByStatus.reviewing, icon: Search, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                { label: 'Accepted', count: analytics.seeker.applicationsByStatus.accepted, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                { label: 'Rejected', count: analytics.seeker.applicationsByStatus.rejected, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' }
              ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-between`}>
                  <div>
                    <p className="text-3xl font-black text-white">{stat.count}</p>
                    <p className={`text-sm font-semibold mt-1 ${stat.color}`}>{stat.label}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 opacity-50 ${stat.color}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="bento-item md:col-span-12">
            <AIJobRecommendations />
          </div>

        </div>
      )}

      {activeRole === 'FINDER' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main KPI Bento Box */}
          <div className="bento-item md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
            {[
              { label: 'Active Jobs', count: analytics.finder.activeJobs, icon: Briefcase, color: 'text-emerald-400' },
              { label: 'Pending', count: analytics.finder.pendingJobs, icon: Clock, color: 'text-amber-400' },
              { label: 'Applications', count: analytics.finder.applicationsReceived, icon: Users, color: 'text-blue-400' },
              { label: 'Total Views', count: analytics.finder.totalViews, icon: Eye, color: 'text-sky-400' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-3xl font-black text-white mt-auto">{stat.count}</p>
              </div>
            ))}
          </div>

          {/* Action Call */}
          <div className="bento-item md:col-span-4 bg-gradient-to-br from-blue-700 via-blue-800 to-sky-700 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl border border-blue-500/30">
            <div className="relative z-10">
              <Plus className="w-10 h-10 text-white bg-white/20 p-2 rounded-xl backdrop-blur-md mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">Create Listing</h3>
              <p className="text-blue-100/80 mb-6 text-sm">Post a new opportunity to reach thousands of highly qualified candidates instantly.</p>
            </div>
            <Link href="/jobs/create" className="relative z-10 w-full py-4 bg-white text-blue-950 font-black rounded-2xl text-center hover:scale-[1.02] transition-transform">
              Post Job Now
            </Link>
          </div>

          {/* Job Performance List */}
          <div className="bento-item md:col-span-12 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Job Performance</h3>
                <p className="text-slate-400">Track how your listings are converting.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {analytics.finder.recentJobs.length > 0 ? analytics.finder.recentJobs.map(job => (
                <div key={job.id} className="bg-slate-950/50 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-500/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-white">{job.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${job.status === 'POSTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm font-medium text-slate-500">
                      <span>{job.jobType}</span>
                      <span>•</span>
                      <span>{job.views} Views</span>
                      <span>•</span>
                      <span className="text-blue-400">{job._count.applications} Applications</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={`/jobs/${job.id}/applications`} className="px-5 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl font-bold hover:bg-blue-500/20 transition-colors text-sm">
                      Manage
                    </Link>
                    <Link href={`/jobs/${job.id}/edit`} className="px-5 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                  <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">No jobs posted yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
