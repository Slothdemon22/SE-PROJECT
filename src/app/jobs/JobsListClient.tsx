'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Job } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MatchScoreBadge from '@/components/MatchScoreBadge'
import { calculateSimpleMatch } from '@/lib/ai/match-scoring'
import { Search, MapPin, Users, Eye, Calendar, Briefcase, X, SlidersHorizontal, ArrowRight } from 'lucide-react'

interface JobWithRelations extends Job {
  createdBy: {
    id: string
    fullName: string | null
    avatarUrl: string | null
    department: string | null
    role: string
  }
  _count: { applications: number }
}

interface JobsListClientProps {
  jobs: JobWithRelations[]
  currentUserId: string
  userProfile?: {
    skills: string[]
    interests: string[]
  } | null
}

const JOB_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_PROJECT: 'Academic Project',
  STARTUP_COLLABORATION: 'Startup/Collaboration',
  PART_TIME_JOB: 'Part-time Job',
  COMPETITION_HACKATHON: 'Competition/Hackathon',
}

const SORT_LABELS: Record<'recent' | 'popular' | 'applications', string> = {
  recent: 'Most Recent',
  popular: 'Most Popular',
  applications: 'Most Applications',
}

export function JobsListClient({ jobs, currentUserId, userProfile }: JobsListClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [locationFilter, setLocationFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'applications'>('recent')
  const [showFilters, setShowFilters] = useState(false)

  const uniqueLocations = useMemo(() => {
    const locations = jobs.map((job) => job.location).filter((loc): loc is string => Boolean(loc))
    return ['ALL', ...Array.from(new Set(locations))]
  }, [jobs])

  const filteredJobs = useMemo(() => {
    let filtered = jobs
    if (selectedType !== 'ALL') filtered = filtered.filter((job) => job.type === selectedType)
    if (locationFilter !== 'ALL') filtered = filtered.filter((job) => job.location === locationFilter)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    switch (sortBy) {
      case 'popular':
        return [...filtered].sort((a, b) => b.views - a.views)
      case 'applications':
        return [...filtered].sort((a, b) => b._count.applications - a._count.applications)
      default:
        return [...filtered].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }
  }, [jobs, selectedType, locationFilter, searchQuery, sortBy])

  const activeFilters = [
    ...(selectedType !== 'ALL'
      ? [{ key: 'type', label: JOB_TYPE_LABELS[selectedType], onRemove: () => setSelectedType('ALL') }]
      : []),
    ...(locationFilter !== 'ALL'
      ? [{ key: 'location', label: locationFilter, onRemove: () => setLocationFilter('ALL') }]
      : []),
    ...(sortBy !== 'recent'
      ? [{ key: 'sort', label: SORT_LABELS[sortBy], onRemove: () => setSortBy('recent') }]
      : []),
  ]

  const formatRelativeDate = (dateValue: Date): string => {
    return new Date(dateValue).toLocaleDateString()
  }

  return (
    <div className="page-shell max-w-[1450px] space-y-6 text-slate-100">
      <div className="section-header mb-0">
        <div>
          <h1 className="section-title">Browse Opportunities</h1>
          <p className="section-subtitle">Explore roles with clear filters and concise job summaries.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <section className="surface-card p-5 md:p-6 xl:col-span-9 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, description, skills, or location"
              className="h-11 pl-10 pr-10 bg-slate-950/60 border-white/10 text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
              className="gap-2 border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'Hide filters' : 'Show filters'}
            </Button>
          </div>

          {showFilters && (
            <div className="space-y-4 border-t border-white/10 pt-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Type</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedType('ALL')} className={selectedType === 'ALL' ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5'}>
                    All
                  </Button>
                  {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                    <Button key={value} size="sm" variant="outline" onClick={() => setSelectedType(value)} className={selectedType === value ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5'}>
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {uniqueLocations.length > 1 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Location</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueLocations.map((location) => (
                      <Button key={location} size="sm" variant="outline" onClick={() => setLocationFilter(location)} className={locationFilter === location ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5'}>
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Sort</p>
                <div className="flex flex-wrap gap-2">
                  {(['recent', 'popular', 'applications'] as const).map((sortValue) => (
                    <Button key={sortValue} size="sm" variant="outline" onClick={() => setSortBy(sortValue)} className={sortBy === sortValue ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' : 'border-white/10 bg-slate-950/50 text-slate-300 hover:bg-white/5'}>
                      {SORT_LABELS[sortValue]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="surface-card p-5 xl:col-span-3">
          <h2 className="text-sm font-semibold text-white">Market Snapshot</h2>
          <p className="mt-1 text-xs text-slate-400">Current inventory and filter impact.</p>
          <div className="mt-4 space-y-3">
            <div className="surface-kpi">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total Openings</p>
              <p className="mt-1 text-2xl font-bold text-white">{jobs.length}</p>
            </div>
            <div className="surface-kpi">
              <p className="text-xs uppercase tracking-wide text-slate-500">Filtered Results</p>
              <p className="mt-1 text-2xl font-bold text-blue-300">{filteredJobs.length}</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-slate-400">
          Showing <span className="font-semibold text-white">{filteredJobs.length}</span> of{' '}
          <span className="font-semibold text-white">{jobs.length}</span> opportunities
        </p>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:border-white/20 hover:text-white"
              >
                {filter.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <Briefcase className="mx-auto mb-3 h-8 w-8 text-slate-500" />
          <h3 className="text-lg font-semibold text-white">No matching opportunities</h3>
          <p className="mt-1 text-sm text-slate-400">Adjust your filters to broaden results.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => {
            const isOwnJob = job.createdBy.id === currentUserId
            return (
              <article key={job.id} className="surface-card-muted p-5 flex h-full flex-col">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge className="border border-blue-500/20 bg-blue-500/10 text-blue-300">
                    {JOB_TYPE_LABELS[job.type] || job.type}
                  </Badge>
                  {!isOwnJob && userProfile && (
                    <MatchScoreBadge
                      score={calculateSimpleMatch(job.tags, userProfile.skills, userProfile.interests)}
                      size="sm"
                      showLabel={false}
                    />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white line-clamp-2">{job.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-400 line-clamp-3">{job.description}</p>

                <div className="mt-4 space-y-1.5 text-sm text-slate-400">
                  {job.location && (
                    <p className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </p>
                  )}
                  {job.teamSize && (
                    <p className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Team size: {job.teamSize}
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{job.views}</span>
                      <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job._count.applications}</span>
                    </div>
                    <Button type="button" size="sm" onClick={() => router.push(`/jobs/${job.id}`)} className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatRelativeDate(job.createdAt)}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
