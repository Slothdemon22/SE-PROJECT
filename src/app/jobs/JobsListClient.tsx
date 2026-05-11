'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Job, Profile } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import MatchScoreBadge from '@/components/MatchScoreBadge'
import { calculateSimpleMatch } from '@/lib/ai/match-scoring'
import gsap from 'gsap'
import {
  Search,
  MapPin,
  Users,
  Eye,
  Calendar,
  Briefcase,
  Filter,
  X,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react'

interface JobWithRelations extends Job {
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
  isPaid: boolean
  paymentAmount: number | null
  paymentCurrency: string
  stripePaymentId: string | null
  paidAt: Date | null
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

const JOB_TYPE_COLORS: Record<string, string> = {
  ACADEMIC_PROJECT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  STARTUP_COLLABORATION: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  PART_TIME_JOB: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  COMPETITION_HACKATHON: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

export function JobsListClient({ jobs, currentUserId, userProfile }: JobsListClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [hideOwnJobs, setHideOwnJobs] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'applications'>('recent')
  const [locationFilter, setLocationFilter] = useState<string>('ALL')
  const [compensationFilter, setCompensationFilter] = useState<string>('ALL')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Extract unique locations and tags from jobs
  const uniqueLocations = useMemo(() => {
    const locations = jobs
      .map(job => job.location)
      .filter((loc): loc is string => !!loc)
    return ['ALL', ...Array.from(new Set(locations))]
  }, [jobs])

  const allTags = useMemo(() => {
    const tags = jobs.flatMap(job => job.tags)
    return Array.from(new Set(tags)).sort()
  }, [jobs])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs

    if (hideOwnJobs) {
      filtered = filtered.filter(job => job.createdBy.id !== currentUserId)
    }

    if (selectedType !== 'ALL') {
      filtered = filtered.filter(job => job.type === selectedType)
    }

    if (locationFilter !== 'ALL') {
      filtered = filtered.filter(job => job.location === locationFilter)
    }

    if (compensationFilter === 'PAID') {
      filtered = filtered.filter(job => job.compensation && job.compensation.toLowerCase().includes('paid'))
    } else if (compensationFilter === 'UNPAID') {
      filtered = filtered.filter(job => !job.compensation || job.compensation.toLowerCase().includes('unpaid') || job.compensation.toLowerCase().includes('volunteer'))
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(job =>
        job.tags && Array.isArray(job.tags) && selectedTags.some(tag => job.tags.includes(tag))
      )
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        (job.tags && Array.isArray(job.tags) && job.tags.some(tag => tag.toLowerCase().includes(query))) ||
        job.createdBy.fullName?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.compensation?.toLowerCase().includes(query)
      )
    }

    switch (sortBy) {
      case 'popular':
        return [...filtered].sort((a, b) => b.views - a.views)
      case 'applications':
        return [...filtered].sort((a, b) => b._count.applications - a._count.applications)
      case 'recent':
      default:
        return [...filtered].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    }
  }, [jobs, selectedType, debouncedSearch, hideOwnJobs, currentUserId, locationFilter, compensationFilter, selectedTags, sortBy])

  // GSAP Animations
  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.job-card')
      gsap.fromTo(elements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      )
    }
  }, [filteredJobs])

  const jobTypes = Object.keys(JOB_TYPE_LABELS)

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedType('ALL')
    setLocationFilter('ALL')
    setCompensationFilter('ALL')
    setSelectedTags([])
    setHideOwnJobs(false)
    setSortBy('recent')
  }

  const activeFiltersCount =
    (selectedType !== 'ALL' ? 1 : 0) +
    (locationFilter !== 'ALL' ? 1 : 0) +
    (compensationFilter !== 'ALL' ? 1 : 0) +
    selectedTags.length +
    (hideOwnJobs ? 1 : 0) +
    (sortBy !== 'recent' ? 1 : 0)

  return (
    <div className="space-y-6 text-slate-100" ref={containerRef}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-blue-400 to-sky-400 bg-clip-text text-transparent">
          Browse Opportunities
        </h1>
        <p className="text-lg text-slate-400">
          Discover exciting projects, jobs, and collaborations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl relative overflow-hidden z-10 w-full max-w-5xl mx-auto mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative space-y-4">
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500" />
            <Input
              type="text"
              placeholder="Search jobs in real-time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-24 h-14 text-lg rounded-2xl w-full shadow-inner bg-slate-950/50 border border-blue-500/20 focus:border-blue-500/50 text-white transition-all pl-14"
            />
            {searchQuery !== debouncedSearch && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-blue-400 font-medium">
                Searching...
              </span>
            )}
            {searchQuery && searchQuery === debouncedSearch && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 bg-slate-950/50 border-white/10 hover:bg-white/5 text-slate-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-blue-600 text-white border-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className="text-sm font-semibold mb-2 block text-slate-300">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedType('ALL')}
                    className={selectedType === 'ALL' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white'}
                  >
                    All ({jobs.length})
                  </Button>
                  {jobTypes.map((type) => {
                    const count = jobs.filter(job => job.type === type).length
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedType(type)}
                        className={selectedType === type ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white'}
                      >
                        {JOB_TYPE_LABELS[type]} ({count})
                      </Button>
                    )
                  })}
                </div>
              </div>

              {uniqueLocations.length > 1 && (
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueLocations.map((location) => (
                      <Button
                        key={location}
                        variant="outline"
                        size="sm"
                        onClick={() => setLocationFilter(location)}
                        className={locationFilter === location ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white'}
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-300">
                  <DollarSign className="w-4 h-4" /> Compensation
                </label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'PAID', 'UNPAID'].map(filter => (
                    <Button
                      key={filter}
                      variant="outline"
                      size="sm"
                      onClick={() => setCompensationFilter(filter)}
                      className={compensationFilter === filter ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white'}
                    >
                      {filter === 'UNPAID' ? 'Unpaid/Volunteer' : filter === 'ALL' ? 'All' : 'Paid'}
                    </Button>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div>
                  <label className="text-sm font-semibold mb-2 block text-slate-300">
                    Skills & Tags {selectedTags.length > 0 && `(${selectedTags.length} selected)`}
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {allTags.slice(0, 20).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`cursor-pointer border-white/10 ${selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-950/50 text-slate-400 hover:text-white'}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block text-slate-300">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'recent', icon: Clock, label: 'Most Recent' },
                    { id: 'popular', icon: TrendingUp, label: 'Most Popular' },
                    { id: 'applications', icon: Users, label: 'Most Applications' },
                  ].map(sort => (
                    <Button
                      key={sort.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setSortBy(sort.id as any)}
                      className={sortBy === sort.id ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-white'}
                    >
                      <sort.icon className="w-4 h-4 mr-1" />
                      {sort.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <input
                  type="checkbox"
                  id="hideOwnJobs"
                  checked={hideOwnJobs}
                  onChange={(e) => setHideOwnJobs(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <label htmlFor="hideOwnJobs" className="text-sm cursor-pointer text-slate-300 hover:text-white transition-colors">
                  Hide my own job postings ({jobs.filter(job => job.createdBy.id === currentUserId).length})
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-slate-400">
          Found <span className="font-bold text-white">{filteredJobs.length}</span> opportunities
        </p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-16 text-center shadow-lg w-full max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">No opportunities found</h3>
          <p className="text-slate-400 text-lg">Try adjusting your search or filters to discover new roles.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const isOwnJob = job.createdBy.id === currentUserId
            return (
              <div
                key={job.id}
                className="job-card bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl cursor-pointer hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group relative flex flex-col h-full"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl"></div>

                <div className="relative flex flex-wrap gap-2 mb-4">
                  <Badge className={JOB_TYPE_COLORS[job.type]}>
                    {JOB_TYPE_LABELS[job.type]}
                  </Badge>
                  {!isOwnJob && userProfile && (
                    <MatchScoreBadge
                      score={calculateSimpleMatch(job.tags, userProfile.skills, userProfile.interests)}
                      size="sm"
                      showLabel={false}
                    />
                  )}
                  {isOwnJob && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Your Post</Badge>
                  )}
                  {job.isPaid && job.paymentAmount && (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold">
                      💰 ${job.paymentAmount.toFixed(0)}
                    </Badge>
                  )}
                </div>

                <h3 className="relative text-xl font-bold mb-3 line-clamp-2 text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {job.title}
                </h3>

                <p className="relative text-sm mb-5 line-clamp-3 text-slate-400 flex-1">
                  {job.description}
                </p>

                <div className="space-y-2 mb-4 text-sm text-slate-400 font-medium">
                  {job.location && (
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-500" /><span>{job.location}</span></div>
                  )}
                  {job.teamSize && (
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /><span>Team size: {job.teamSize}</span></div>
                  )}
                  {job.compensation && (
                    <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-500" /><span>{job.compensation}</span></div>
                  )}
                </div>

                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-white/10 bg-slate-950/50 text-slate-300">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-white/10 bg-slate-950/50 text-slate-500">
                        +{job.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="relative pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {job.createdBy.avatarUrl ? (
                      <img src={job.createdBy.avatarUrl} alt={job.createdBy.fullName || 'User'} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold border border-white/10">
                        {job.createdBy.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="text-xs">
                      <p className="font-bold text-slate-200">{job.createdBy.fullName}</p>
                      <p className="text-slate-500 font-medium">{job.createdBy.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-lg border border-white/5"><Eye className="w-3.5 h-3.5 text-blue-400" /> {job.views}</span>
                    <span className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-lg border border-white/5"><Users className="w-3.5 h-3.5 text-blue-400" /> {job._count.applications}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
