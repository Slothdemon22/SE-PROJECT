'use client'

import { useActiveRole } from '@/hooks/useActiveRole'
import { Search, Briefcase, Plus, Users, BookmarkIcon, TrendingUp, Clock, CheckCircle, XCircle, Sparkles, Eye, MousePointerClick, Percent, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

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

  if (isLoading || loadingAnalytics) {
    return (
      <div className="space-y-8 animate-pulse" suppressHydrationWarning>
        <div className="glass-card p-8 h-32" suppressHydrationWarning></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 h-24" suppressHydrationWarning></div>
          <div className="glass-card p-6 h-24" suppressHydrationWarning></div>
          <div className="glass-card p-6 h-24" suppressHydrationWarning></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#151A24] border border-[var(--border)] p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-[#1A75E5]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName || 'Profile'}
              className="h-24 w-24 rounded-full object-cover border-4 border-[var(--border)] shadow-lg"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#1A75E5] to-[#0B0E14] border-4 border-[var(--border)] shadow-lg flex items-center justify-center text-3xl font-bold text-white">
              {profile.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-3 text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#1A75E5]">{profile.fullName}</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-base">
              <div className="flex items-center gap-2 bg-[#1A75E5]/10 border border-[#1A75E5]/20 px-4 py-1.5 rounded-full text-blue-400 font-medium">
                {activeRole === 'SEEKER' ? (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Finding Work Mode</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    <span>Posting Jobs Mode</span>
                  </>
                )}
              </div>
              <span className="text-[var(--foreground-muted)]">{profile.department || 'No department set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seeker Mode Dashboard */}
      {activeRole === 'SEEKER' && analytics && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#151A24] border border-[var(--border)] p-6 rounded-2xl shadow-lg hover:border-[#1A75E5]/50 hover:shadow-[#1A75E5]/10 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Applications Sent
                </p>
                <div className="p-2 rounded-lg bg-[#1D2B44] text-blue-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">
                {analytics.seeker.applicationsSent}
              </p>
            </div>

            <div className="bg-[#151A24] border border-[var(--border)] p-6 rounded-2xl shadow-lg hover:border-[#1A75E5]/50 hover:shadow-[#1A75E5]/10 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Saved Jobs
                </p>
                <div className="p-2 rounded-lg bg-[#1D2B44] text-purple-400 group-hover:scale-110 transition-transform">
                  <BookmarkIcon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">
                {analytics.seeker.savedJobs}
              </p>
            </div>

            <div className="bg-[#151A24] border border-[var(--border)] p-6 rounded-2xl shadow-lg hover:border-[#1A75E5]/50 hover:shadow-[#1A75E5]/10 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  Profile Views
                </p>
                <div className="p-2 rounded-lg bg-[#1D2B44] text-green-400 group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-black text-white">
                {analytics.seeker.profileViews}
              </p>
            </div>
          </div>

          {/* Application Status Breakdown */}
          {analytics.seeker.applicationsSent > 0 && (
            <div className="bg-[#151A24] border border-[var(--border)] p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-white tracking-tight">
                Application Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl border border-yellow-900/30 bg-gradient-to-b from-yellow-500/10 to-transparent">
                  <Clock className="w-8 h-8 text-yellow-500 mb-4" />
                  <p className="text-3xl font-bold text-white mb-1">
                    {analytics.seeker.applicationsByStatus.pending}
                  </p>
                  <p className="text-sm text-yellow-200/70 font-medium">Pending</p>
                </div>
                <div className="p-6 rounded-xl border border-blue-900/30 bg-gradient-to-b from-blue-500/10 to-transparent">
                  <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
                  <p className="text-3xl font-bold text-white mb-1">
                    {analytics.seeker.applicationsByStatus.reviewing}
                  </p>
                  <p className="text-sm text-blue-200/70 font-medium">Reviewing</p>
                </div>
                <div className="p-6 rounded-xl border border-green-900/30 bg-gradient-to-b from-green-500/10 to-transparent">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
                  <p className="text-3xl font-bold text-white mb-1">
                    {analytics.seeker.applicationsByStatus.accepted}
                  </p>
                  <p className="text-sm text-green-200/70 font-medium">Accepted</p>
                </div>
                <div className="p-6 rounded-xl border border-red-900/30 bg-gradient-to-b from-red-500/10 to-transparent">
                  <XCircle className="w-8 h-8 text-red-500 mb-4" />
                  <p className="text-3xl font-bold text-white mb-1">
                    {analytics.seeker.applicationsByStatus.rejected}
                  </p>
                  <p className="text-sm text-red-200/70 font-medium">Rejected</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/jobs" className="block group">
              <div className="bg-[#151A24] border border-[var(--border)] p-8 rounded-2xl shadow-lg hover:border-[var(--accent)] hover:shadow-xl transition-all h-full">
                <div className="flex items-start gap-5">
                  <div className="p-4 rounded-xl bg-[#1D2B44] group-hover:bg-[#1A75E5] transition-colors">
                    <Search className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 text-white group-hover:text-[var(--accent)] transition-colors">
                      Browse Opportunities
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-4">
                      Find projects, internships, and collaborations that match your skills. Apply with one click.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                      Explore Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/bookmarks" className="block group">
              <div className="bg-[#151A24] border border-[var(--border)] p-8 rounded-2xl shadow-lg hover:border-[#8B5CF6] hover:shadow-xl transition-all h-full">
                <div className="flex items-start gap-5">
                  <div className="p-4 rounded-xl bg-[#1D2B44] group-hover:bg-[#8B5CF6] transition-colors">
                    <BookmarkIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 text-white group-hover:text-[#8B5CF6] transition-colors">
                      Saved Jobs
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-4">
                      Review and apply to jobs you've bookmarked. Don't lose track of your favorites.
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B5CF6]">
                      View Saved <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* Finder Mode Dashboard */}
      {activeRole === 'FINDER' && analytics && (
        <>
          {/* Overview Stats */}
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
              Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Active Jobs</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{analytics.finder.activeJobs}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Pending</p>
                </div>
                <p className="text-3xl font-bold text-yellow-600">{analytics.finder.pendingJobs}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Applications</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                  {analytics.finder.applicationsReceived}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Total Views</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                  {analytics.finder.totalViews}
                </p>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <BookmarkIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Total Bookmarks</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {analytics.finder.totalBookmarks}
                  </p>
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                Users who saved your jobs
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Percent className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Avg Application Rate</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {analytics.finder.averageApplicationRate}%
                  </p>
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                Applications per view
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Engagement Score</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {analytics.finder.activeJobs > 0
                      ? Math.round((analytics.finder.applicationsReceived / analytics.finder.activeJobs) * 10) / 10
                      : 0}
                  </p>
                </div>
              </div>
              <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                Average apps per job
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Plus className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    Post a New Job
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Create a new opportunity and find talented collaborators
                  </p>
                  <Link href="/jobs/create" className="btn-gradient inline-block px-6 py-2 text-sm">
                    Create Job
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                  <Users className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    Manage Applications
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--foreground-muted)' }}>
                    Review and respond to applications from candidates
                  </p>
                  <Link href="/applications" className="btn-gradient inline-block px-6 py-2 text-sm">
                    View Applications
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Job Analytics */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Job Performance Analytics
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                  Detailed metrics for each job posting
                </p>
              </div>
              <Link href="/jobs/create" className="btn-gradient px-6 py-3 text-sm font-semibold">
                + Post New Job
              </Link>
            </div>

            {analytics.finder.recentJobs.length > 0 ? (
              <div className="space-y-4">
                {analytics.finder.recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="glass-card p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="font-bold text-lg hover:text-[#1E3A8A] transition-colors"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {job.title}
                          </Link>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'POSTED'
                              ? 'bg-green-100 text-green-700'
                              : job.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                          <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(30, 58, 138, 0.1)', color: '#1E3A8A' }}>
                            {job.jobType}
                          </span>
                          {job.company && (
                            <span style={{ color: 'var(--foreground-muted)' }}>
                              {job.company}
                            </span>
                          )}
                          {job.location && (
                            <span style={{ color: 'var(--foreground-muted)' }}>
                              📍 {job.location}
                            </span>
                          )}
                        </div>

                        {/* Analytics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Views</span>
                            </div>
                            <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                              {job.views}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Applications</span>
                            </div>
                            <p className="text-lg font-bold text-blue-600">
                              {job._count.applications}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <BookmarkIcon className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Saved</span>
                            </div>
                            <p className="text-lg font-bold text-purple-600">
                              {job._count.bookmarks}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MousePointerClick className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>App Rate</span>
                            </div>
                            <p className="text-lg font-bold text-green-600">
                              {job.applicationRate}%
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" style={{ color: 'var(--foreground-muted)' }} />
                              <span className="text-xs" style={{ color: 'var(--foreground-muted)' }}>Save Rate</span>
                            </div>
                            <p className="text-lg font-bold text-orange-600">
                              {job.bookmarkRate}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/jobs/${job.id}/applications`}
                          className="btn-gradient px-4 py-2 text-sm text-center whitespace-nowrap"
                        >
                          View Applications
                        </Link>
                        <Link
                          href={`/jobs/${job.id}/edit`}
                          className="glass-card px-4 py-2 text-sm text-center whitespace-nowrap hover:scale-105 transition-transform"
                          style={{ color: 'var(--foreground)' }}
                        >
                          Edit Job
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  href="/my-jobs"
                  className="block text-center text-sm font-medium pt-4 hover:text-[#1E3A8A] transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  View All Your Jobs →
                </Link>
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase
                  className="h-16 w-16 mx-auto mb-4"
                  style={{ color: 'var(--foreground-muted)', opacity: 0.5 }}
                />
                <p className="text-lg mb-2 font-semibold" style={{ color: 'var(--foreground)' }}>
                  No jobs posted yet
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>
                  Create your first job posting to find talented collaborators
                </p>
                <Link href="/jobs/create" className="btn-gradient px-6 py-3 text-sm font-semibold inline-block">
                  Post Your First Job
                </Link>
              </div>
            )}</div>
        </>
      )}

      <div className="bg-[#151A24] border border-[var(--border)] p-8 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 text-white tracking-tight">
            Your Profile
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" /> Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-1.5 rounded-full text-sm font-medium border border-[#1E3A8A]/30 bg-[#1E3A8A]/10 text-white shadow-sm hover:bg-[#1E3A8A]/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[var(--foreground-muted)] italic">
                    No skills added yet
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--foreground-muted)] flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-[var(--accent)]" /> Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-4 py-1.5 rounded-full text-sm font-medium border border-[var(--border)] bg-[#0B0E14] text-white shadow-sm hover:border-[var(--accent)] transition-colors"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[var(--foreground-muted)] italic">
                    No interests added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-end">
            <Link href="/profile" className="text-sm font-medium text-[var(--accent)] hover:text-white transition-colors flex items-center gap-2 group/btn">
              Edit Profile <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Job Recommendations - Only for Seekers */}
      {activeRole === 'SEEKER' && (
        <AIJobRecommendations />
      )}
    </div>
  )
}

