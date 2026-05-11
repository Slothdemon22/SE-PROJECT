'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Job, Profile, Bookmark } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import gsap from 'gsap'
import {
  Search,
  Bookmark as BookmarkIcon,
  MapPin,
  Users,
  Eye,
  Calendar,
  Briefcase,
  Trash2,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      bookmark.job.title.toLowerCase().includes(query) ||
      bookmark.job.description.toLowerCase().includes(query) ||
      (bookmark.job.tags && Array.isArray(bookmark.job.tags) && bookmark.job.tags.some((tag) => tag.toLowerCase().includes(query))) ||
      bookmark.job.createdBy.fullName?.toLowerCase().includes(query)
    )
  })

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.job-card')
      gsap.fromTo(elements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      )
    }
  }, [filteredBookmarks])

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

      router.refresh()
    } catch (error) {
      alert('Failed to remove bookmark. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-6 text-slate-100" ref={containerRef}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
        >
          Saved Jobs
        </h1>
        <p className="text-lg text-slate-400">
          Your bookmarked opportunities ({bookmarks.length})
        </p>
      </div>

      {/* Search Bar */}
      {bookmarks.length > 0 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-xl w-full max-w-5xl mx-auto relative overflow-hidden z-10 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500"
            />
            <Input
              type="text"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {filteredBookmarks.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-lg w-full max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookmarkIcon
              className="w-10 h-10 text-slate-500"
            />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
            {bookmarks.length === 0
              ? 'No saved jobs yet'
              : 'No jobs found matching your search'}
          </h3>
          <p className="mb-8 text-slate-400 text-lg">
            {bookmarks.length === 0
              ? 'Start bookmarking jobs to save them for later'
              : 'Try adjusting your search query'}
          </p>
          {bookmarks.length === 0 && (
            <Button onClick={() => router.push('/jobs')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-blue-500/20">
              Browse Opportunities
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => {
            const job = bookmark.job
            const isOwnJob = job.createdBy.id === currentUserId

            return (
              <div
                key={bookmark.id}
                className="job-card bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl cursor-pointer hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,235,0.12)] transition-all duration-300 relative flex flex-col h-full group overflow-hidden"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                {/* Remove Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveBookmark(job.id)
                  }}
                  disabled={removingId === job.id}
                  className="absolute top-4 right-4 p-2.5 rounded-full hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors z-10 bg-slate-950/50 border border-white/5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Job Card Content */}
                <div className="relative flex-1">
                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-2 mb-4 pr-12">
                    <Badge className={JOB_TYPE_COLORS[job.type]}>
                      {JOB_TYPE_LABELS[job.type]}
                    </Badge>
                    {isOwnJob && (
                      <Badge
                        className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      >
                        Your Post
                      </Badge>
                    )}
                    {job.isFilled && (
                      <Badge variant="outline" className="bg-slate-800 text-slate-300 border-white/10">
                        Filled
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="relative text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {job.title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-sm mb-5 line-clamp-3 text-slate-400 flex-1">
                    {job.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 text-sm text-slate-400 font-medium">
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

                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-slate-950 border-white/10 text-slate-300 px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-slate-950 border-white/10 text-slate-500 px-3 py-1">
                          +{job.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="relative pt-4 mt-auto border-t border-white/10">
                  {/* Poster Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {job.createdBy.avatarUrl ? (
                        <img
                          src={job.createdBy.avatarUrl}
                          alt={job.createdBy.fullName || 'User'}
                          className="w-10 h-10 rounded-xl object-cover border border-white/5"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold border border-white/5"
                          style={{
                            background:
                              'linear-gradient(135deg, #2563eb, #0ea5e9)',
                          }}
                        >
                          {job.createdBy.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="text-xs">
                        <p className="font-bold text-slate-200">
                          {job.createdBy.fullName}
                        </p>
                        <p className="text-slate-500 font-medium">
                          {job.createdBy.department}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div
                      className="flex items-center gap-3 text-xs font-semibold text-slate-500"
                    >
                      <span className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-lg border border-white/5">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        {job.views}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-lg border border-white/5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        {job._count.applications}
                      </span>
                    </div>
                  </div>

                  {/* Saved Date */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-4"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
