'use client'

import { useActiveRole } from '@/hooks/useActiveRole'
import { Search, Briefcase, Plus, Users, Clock, CheckCircle, XCircle, Eye, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AIJobRecommendations from '@/components/AIJobRecommendations'

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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

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

  if (isLoading || loadingAnalytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 rounded-3xl">
      <div className="page-shell space-y-6">
        <div className="surface-card p-6 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-black text-white border border-white/10">
                  {profile.fullName?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {profile.fullName?.split(' ')[0]}
                </h1>
                <p className="text-slate-400 text-sm">
                  {activeRole === 'SEEKER' ? 'Track your applications and discover relevant jobs.' : 'Manage postings and monitor hiring performance.'}
                </p>
              </div>
            </div>
            <Link href="/profile" className="focus-ring inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors">
              <LayoutGrid className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {activeRole === 'SEEKER' && analytics && (
          <div className="grid grid-cols-1 gap-6">
            <section className="surface-card p-5 md:p-6">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Overview</h2>
                  <p className="section-subtitle">Your core activity metrics at a glance.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="surface-kpi">
                  <p className="text-sm text-slate-400 mb-2">Applications</p>
                  <p className="text-3xl font-bold text-white">{analytics.seeker.applicationsSent}</p>
                </div>
                <div className="surface-kpi">
                  <p className="text-sm text-slate-400 mb-2">Saved Jobs</p>
                  <p className="text-3xl font-bold text-white">{analytics.seeker.savedJobs}</p>
                </div>
                <div className="surface-kpi">
                  <p className="text-sm text-slate-400 mb-2">Profile Views</p>
                  <p className="text-3xl font-bold text-white">{analytics.seeker.profileViews}</p>
                </div>
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Application Pipeline</h2>
                  <p className="section-subtitle">Current status distribution for your submitted applications.</p>
                </div>
                <Link href="/my-applications" className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300">
                  View all applications
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Pending', count: analytics.seeker.applicationsByStatus.pending, icon: Clock },
                  { label: 'Reviewing', count: analytics.seeker.applicationsByStatus.reviewing, icon: Search },
                  { label: 'Accepted', count: analytics.seeker.applicationsByStatus.accepted, icon: CheckCircle },
                  { label: 'Rejected', count: analytics.seeker.applicationsByStatus.rejected, icon: XCircle },
                ].map((stat) => (
                  <div key={stat.label} className="surface-kpi flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
                    </div>
                    <stat.icon className="w-5 h-5 text-slate-500" />
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Recommended for You</h2>
                  <p className="section-subtitle">Roles aligned with your current profile and interests.</p>
                </div>
                <Link href="/jobs" className="focus-ring inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm text-slate-200 hover:bg-white/5">
                  Browse all jobs
                </Link>
              </div>
              <AIJobRecommendations />
            </section>
          </div>
        )}

        {activeRole === 'FINDER' && analytics && (
          <div className="grid grid-cols-1 gap-6">
            <section className="surface-card p-5 md:p-6">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Hiring Overview</h2>
                  <p className="section-subtitle">Performance snapshot across your active opportunities.</p>
                </div>
                <Link href="/jobs/create" className="focus-ring inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Create Job
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Active Jobs', count: analytics.finder.activeJobs, icon: Briefcase },
                  { label: 'Pending', count: analytics.finder.pendingJobs, icon: Clock },
                  { label: 'Applications', count: analytics.finder.applicationsReceived, icon: Users },
                  { label: 'Total Views', count: analytics.finder.totalViews, icon: Eye },
                ].map((stat) => (
                  <div key={stat.label} className="surface-kpi flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
                    </div>
                    <stat.icon className="w-5 h-5 text-slate-500" />
                  </div>
                ))}
              </div>
            </section>

            <section className="surface-card p-5 md:p-6">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Recent Job Performance</h2>
                  <p className="section-subtitle">Monitor recent listings and manage next actions quickly.</p>
                </div>
              </div>
              <div className="space-y-3">
                {analytics.finder.recentJobs.length > 0 ? analytics.finder.recentJobs.map(job => (
                  <div key={job.id} className="surface-kpi flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{job.title}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {job.jobType} • {job.views} views • {job._count.applications} applications
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/jobs/${job.id}/applications`} className="focus-ring px-3 py-2 text-sm rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                        Manage
                      </Link>
                      <Link href={`/jobs/${job.id}/edit`} className="focus-ring px-3 py-2 text-sm rounded-lg border border-white/10 text-slate-200 hover:bg-white/5">
                        Edit
                      </Link>
                    </div>
                  </div>
                )) : (
                  <div className="surface-kpi text-center py-10">
                    <p className="text-slate-400">No jobs posted yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
