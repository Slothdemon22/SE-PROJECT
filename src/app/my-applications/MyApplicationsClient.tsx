'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Application, Job, Profile } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MatchScoreBadge from '@/components/MatchScoreBadge'
import gsap from 'gsap'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  FileText,
  MapPin,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-react'

interface ApplicationWithJob extends Application {
  job: {
    id: string
    title: string
    type: string
    description: string
    location: string | null
    compensation: string | null
    isPublished: boolean
    isFilled: boolean
    createdBy: {
      id: string
      fullName: string | null
      email: string | null
      avatarUrl: string | null
      department: string | null
    }
  }
}

interface MyApplicationsClientProps {
  applications: ApplicationWithJob[]
  counts: {
    ALL: number
    PENDING: number
    SHORTLISTED: number
    ACCEPTED: number
    REJECTED: number
  }
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Under Review',
    icon: Clock,
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    description: 'Your application is being reviewed'
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    icon: Star,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: "Congratulations! You've been shortlisted"
  },
  ACCEPTED: {
    label: 'Accepted',
    icon: CheckCircle2,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Your application has been accepted!'
  },
  REJECTED: {
    label: 'Not Selected',
    icon: XCircle,
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Thank you for applying'
  },
}

const JOB_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_PROJECT: 'Academic Project',
  STARTUP_COLLABORATION: 'Startup/Collaboration',
  PART_TIME_JOB: 'Part-time Job',
  COMPETITION_HACKATHON: 'Competition/Hackathon',
}

export function MyApplicationsClient({ applications, counts }: MyApplicationsClientProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredApplications =
    statusFilter === 'ALL'
      ? applications
      : applications.filter((app) => app.status === statusFilter)

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.app-card')
      gsap.fromTo(elements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      )
    }
  }, [filteredApplications])

  const toggleExpand = (appId: string) => {
    setExpandedApplications((prev) => {
      const next = new Set(prev)
      if (next.has(appId)) {
        next.delete(appId)
      } else {
        next.add(appId)
      }
      return next
    })
  }

  return (
    <div className="space-y-8 text-slate-100" ref={containerRef}>
      {/* Header */}
      <div className="text-center md:text-left">
        <h1
          className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
        >
          My Applications
        </h1>
        <p className="text-lg text-slate-400">
          Track all your job applications and their status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl text-center shadow-lg hover:border-blue-500/30 transition-colors">
          <div className="text-3xl font-black text-white mb-1">
            {counts.ALL}
          </div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Total
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-yellow-500/10 p-6 rounded-3xl text-center shadow-lg hover:border-yellow-500/30 transition-colors">
          <div className="text-3xl font-black text-yellow-500 mb-1">{counts.PENDING}</div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Pending
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/10 p-6 rounded-3xl text-center shadow-lg hover:border-blue-500/30 transition-colors">
          <div className="text-3xl font-black text-blue-400 mb-1">{counts.SHORTLISTED}</div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Shortlisted
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/10 p-6 rounded-3xl text-center shadow-lg hover:border-emerald-500/30 transition-colors">
          <div className="text-3xl font-black text-emerald-400 mb-1">{counts.ACCEPTED}</div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Accepted
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-xl border border-rose-500/10 p-6 rounded-3xl text-center shadow-lg hover:border-rose-500/30 transition-colors">
          <div className="text-3xl font-black text-rose-400 mb-1">{counts.REJECTED}</div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Not Selected
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {(['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'] as const).map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={`rounded-xl px-5 py-2 ${statusFilter === status ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white'}`}
          >
            {status} <span className="ml-2 opacity-70">({counts[status]})</span>
          </Button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-lg w-full max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
            No applications yet
          </h3>
          <p className="mb-8 text-slate-400 text-lg">
            {statusFilter === 'ALL'
              ? 'Start applying to jobs to see them here'
              : `No ${statusFilter.toLowerCase()} applications`}
          </p>
          <Button onClick={() => router.push('/jobs')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-blue-500/20">
            Browse Opportunities
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => {
            const isExpanded = expandedApplications.has(application.id)
            const statusConfig = STATUS_CONFIG[application.status as keyof typeof STATUS_CONFIG]
            const StatusIcon = statusConfig.icon

            return (
              <div key={application.id} className="app-card bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300">
                {/* Application Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    {/* Job Title */}
                    <h3
                      className="text-2xl font-bold mb-3 cursor-pointer text-white hover:text-blue-400 transition-colors leading-tight"
                      onClick={() => router.push(`/jobs/${application.job.id}`)}
                    >
                      {application.job.title}
                    </h3>

                    {/* Job Type & Status */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge variant="outline" className="border-white/10 bg-slate-950 text-slate-300 px-3 py-1">
                        {JOB_TYPE_LABELS[application.job.type] || application.job.type}
                      </Badge>
                      <Badge className={`${statusConfig.color} px-3 py-1 font-medium`}>
                        <StatusIcon className="w-4 h-4 mr-1.5" />
                        {statusConfig.label}
                      </Badge>
                      <MatchScoreBadge score={application.matchScore} size="sm" />
                      {application.job.isFilled && (
                        <Badge className="bg-slate-800 text-slate-300 border-white/10 px-3 py-1">
                          Position Filled
                        </Badge>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm mb-4 text-slate-400 font-medium">
                      {application.job.location && (
                         <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          {application.job.location}
                        </span>
                      )}
                      {application.job.compensation && (
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          {application.job.compensation}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Posted By */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Posted by: <span className="text-slate-300 font-medium">{application.job.createdBy.fullName || application.job.createdBy.email}</span></span>
                      {application.job.createdBy.department && (
                        <span>• {application.job.createdBy.department}</span>
                      )}
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <Button
                    variant="outline"
                    onClick={() => toggleExpand(application.id)}
                    className="bg-slate-950/50 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 shrink-0 w-full md:w-auto mt-4 md:mt-0"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        View Details
                      </>
                    )}
                  </Button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-6 pt-6 mt-6 border-t border-white/10">
                    {/* Status Info */}
                    <div className={`p-5 rounded-2xl border ${statusConfig.color.includes('yellow') ? 'bg-yellow-500/5 border-yellow-500/20' : statusConfig.color.includes('blue') ? 'bg-blue-500/5 border-blue-500/20' : statusConfig.color.includes('emerald') ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                      <p className="font-bold text-lg mb-1 text-white">
                        {statusConfig.description}
                      </p>
                      {application.status === 'ACCEPTED' && (
                        <p className="text-emerald-300">
                          The job poster will contact you soon with next steps.
                        </p>
                      )}
                      {application.status === 'SHORTLISTED' && (
                        <p className="text-blue-300">
                          You're in the final selection. The poster will review your application soon.
                        </p>
                      )}
                    </div>

                    {/* Job Description */}
                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                      <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                        Job Description
                      </h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {application.job.description}
                      </p>
                    </div>

                    {/* Your Proposal */}
                    {application.proposal && (
                      <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-400" />
                          Your Cover Letter
                        </h4>
                        <div
                          className="bg-slate-900 border border-white/5 rounded-xl p-5 whitespace-pre-wrap text-slate-300 custom-scrollbar"
                          style={{
                            maxHeight: '250px',
                            overflowY: 'auto',
                          }}
                        >
                          {application.proposal}
                        </div>
                      </div>
                    )}

                    {/* Your Resume */}
                    {application.resumeName && (
                      <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <h4 className="font-bold text-white flex items-center gap-2">
                          Your Resume
                        </h4>
                        <Badge variant="outline" className="bg-slate-900 border-white/10 text-slate-300 px-4 py-2">
                          {application.resumeName}
                        </Badge>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-white/10">
                      <Button
                        onClick={() => router.push(`/jobs/${application.job.id}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-2 rounded-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Job Listing
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
