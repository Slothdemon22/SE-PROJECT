'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Job, Bookmark } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  Search,
  Bookmark as BookmarkIcon,
  MapPin,
  Users,
  Eye,
  Calendar,
  Briefcase,
  Trash2,
  X,
} from 'lucide-react'

interface BookmarkWithJob extends Bookmark {
  job: Job & {
    createdBy: {
      id: string
      fullName: string | null
      avatarUrl: string | null
      department: string | null
      year: string | null
      role: string
    }
    _count: {
      applications: number
    }
  }
}

interface SavedJobsClientProps {
  bookmarks: BookmarkWithJob[]
  currentUserId: string
}

const JOB_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_PROJECT: 'Academic Project',
  STARTUP_COLLABORATION: 'Startup/Collaboration',
  PART_TIME_JOB: 'Part-time Job',
  COMPETITION_HACKATHON: 'Competition/Hackathon',
}

const JOB_TYPE_COLORS: Record<string, string> = {
  ACADEMIC_PROJECT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  STARTUP_COLLABORATION: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  PART_TIME_JOB: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  COMPETITION_HACKATHON: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

export function SavedJobsClient({ bookmarks, currentUserId }: SavedJobsClientProps) {
  const router = useRouter()
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks
    const query = searchQuery.toLowerCase()
    return bookmarks.filter((bookmark) => {
      const { job } = bookmark
      return (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        job.createdBy.fullName?.toLowerCase().includes(query)
      )
    })
  }, [bookmarks, searchQuery])

  const handleRemoveBookmark = async (jobId: string) => {
    if (!confirm('Remove this job from your saved list?')) {
      return
    }

    setRemovingId(jobId)
    try {
      const response = await fetch(`/api/bookmarks?jobId=${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove bookmark')
      }

      toast.success('Removed from saved jobs')
      router.refresh()
    } catch (error) {
      toast.error('Failed to remove bookmark. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="page-shell max-w-[1240px] space-y-6 text-slate-100">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-semibold text-white">Saved Jobs</h1>
        <p className="text-slate-400">Keep track of opportunities you want to revisit.</p>
      </div>

      <section className="surface-card p-5 md:p-6 space-y-4">
        {bookmarks.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              type="text"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl w-full bg-slate-950/60 border-white/10 text-white pl-12 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="surface-kpi">
            <p className="text-xs uppercase tracking-wide text-slate-500">Saved Total</p>
            <p className="text-2xl font-bold text-white mt-1">{bookmarks.length}</p>
          </div>
          <div className="surface-kpi">
            <p className="text-xs uppercase tracking-wide text-slate-500">Visible Results</p>
            <p className="text-2xl font-bold text-blue-300 mt-1">{filteredBookmarks.length}</p>
          </div>
          <div className="surface-kpi">
            <p className="text-xs uppercase tracking-wide text-slate-500">Your Posts Saved</p>
            <p className="text-2xl font-bold text-slate-200 mt-1">
              {bookmarks.filter((bookmark) => bookmark.job.createdBy.id === currentUserId).length}
            </p>
          </div>
        </div>
      </section>

      {filteredBookmarks.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <div className="w-14 h-14 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookmarkIcon className="w-7 h-7 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            {bookmarks.length === 0 ? 'No saved jobs yet' : 'No jobs found'}
          </h3>
          <p className="mt-2 mb-6 text-slate-400">
            {bookmarks.length === 0
              ? 'Bookmark opportunities from the jobs page and they will appear here.'
              : 'Try a different search keyword.'}
          </p>
          {bookmarks.length === 0 && (
            <Button onClick={() => router.push('/jobs')} className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Opportunities
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredBookmarks.map((bookmark) => {
            const job = bookmark.job
            const isOwnJob = job.createdBy.id === currentUserId

            return (
              <article
                key={bookmark.id}
                className="job-card surface-card p-5 rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all flex flex-col h-full relative"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveBookmark(job.id)
                  }}
                  disabled={removingId === job.id}
                  className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 border border-white/10 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3 pr-10">
                    <Badge className={JOB_TYPE_COLORS[job.type]}>
                      {JOB_TYPE_LABELS[job.type]}
                    </Badge>
                    {isOwnJob && (
                      <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">Your Post</Badge>
                    )}
                    {job.isFilled && (
                      <Badge variant="outline" className="bg-slate-800 text-slate-300 border-white/10">Filled</Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-white leading-tight">{job.title}</h3>

                  <p className="text-sm mb-4 line-clamp-3 text-slate-400">{job.description}</p>

                  <div className="space-y-2 mb-4 text-sm text-slate-400">
                    {job.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.teamSize && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span>Team size: {job.teamSize}</span>
                      </div>
                    )}
                    {job.compensation && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                        <span>{job.compensation}</span>
                      </div>
                    )}
                  </div>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-slate-950/60 border-white/10 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-slate-950/60 border-white/10 text-slate-500">
                          +{job.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-auto border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {job.createdBy.avatarUrl ? (
                        <img
                          src={job.createdBy.avatarUrl}
                          alt={job.createdBy.fullName || 'User'}
                          className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold border border-white/10 bg-slate-800">
                          {job.createdBy.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">{job.createdBy.fullName}</p>
                        <p className="text-slate-500">{job.createdBy.department || 'Community'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {job.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {job._count.applications}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
