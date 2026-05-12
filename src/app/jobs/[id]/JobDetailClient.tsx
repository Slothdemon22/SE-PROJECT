'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookmarkButton } from '@/components/BookmarkButton'
import { JobPaymentButton } from '@/components/JobPaymentButton'
import { RequestVideoCallButton } from '@/components/RequestVideoCallButton'
import { ApplicationForm } from './ApplicationForm'
import AIInterviewTips from '@/components/AIInterviewTips'
import AICoverLetterGenerator from '@/components/AICoverLetterGenerator'
import CalculateMyMatchButton from '@/components/CalculateMyMatchButton'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Eye,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  CreditCard,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

interface JobWithRelations {
  id: string
  title: string
  type: string
  description: string
  requirements: string | null
  duration: string | null
  compensation: string | null
  location: string | null
  teamSize: string | null
  tags: string[]
  status: string
  isDraft: boolean
  isFilled: boolean
  isPublished: boolean
  views: number
  applicationsCount: number
  rejectionReason: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  approvedAt: Date | null
  approvedBy: string | null
  createdById: string
  isPaid: boolean
  paymentAmount: number | null
  paymentCurrency: string
  stripePaymentId: string | null
  paidAt: Date | null
  createdBy: {
    id: string
    fullName: string | null
    email: string | null
    avatarUrl: string | null
    department: string | null
    year: string | null
    role: string
  }
  applications: Array<{
    id: string
    status: string
    createdAt: Date
  }>
  _count: {
    applications: number
  }
}

interface ProfileType {
  id: string
  userId: string
  email: string | null
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
  skills: string[]
  interests: string[]
  role: string
  department: string | null
  year: string | null
  createdAt: Date
  updatedAt: Date
}

interface JobDetailClientProps {
  job: JobWithRelations
  currentProfile: ProfileType
  initialBookmarked: boolean
  existingCallRequest?: {
    id: string
    status: string
    roomId: string | null
    scheduledTime: Date | null
    createdAt: Date
  } | null
}

const JOB_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_PROJECT: 'Academic Project',
  STARTUP_COLLABORATION: 'Startup/Collaboration',
  PART_TIME_JOB: 'Part-time Job',
  COMPETITION_HACKATHON: 'Competition/Hackathon',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  APPROVED: 'bg-green-500/20 text-green-300 border-green-500/30',
  REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
}

const APPLICATION_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-300',
  ACCEPTED: 'bg-green-500/20 text-green-300',
  REJECTED: 'bg-red-500/20 text-red-300',
}

export function JobDetailClient({ job, currentProfile, initialBookmarked, existingCallRequest }: JobDetailClientProps) {
  const router = useRouter()

  const isOwner = job.createdById === currentProfile.id
  const userApplication = Array.isArray(job.applications) && job.applications.length > 0 ? job.applications[0] : null
  const hasApplied = !!userApplication

  const handleApplicationSuccess = (): void => {
    router.refresh()
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {!isOwner && (
          <BookmarkButton
            jobId={job.id}
            initialBookmarked={initialBookmarked}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 surface-card p-6 md:p-7">
          <div className="mb-7">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="text-sm px-3 py-1 border-0 bg-blue-600 text-white">
                {JOB_TYPE_LABELS[job.type] || job.type}
              </Badge>
              <Badge className={STATUS_COLORS[job.status] || ''}>{job.status}</Badge>
              {job.isDraft && <Badge variant="outline" className="border-white/20 text-slate-300">Draft</Badge>}
              {job.isFilled && <Badge className="bg-slate-800 text-slate-300 border-white/10">Position Filled</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-4">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                {job.views} views
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                {job._count.applications} applicants
              </span>
            </div>
          </div>

          <div className="mb-6 surface-card-muted p-5">
            <h2 className="text-lg font-semibold mb-3 text-white">About this role</h2>
            <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{job.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {job.requirements && (
              <div className="surface-card-muted p-5 md:col-span-2">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  Requirements
                </h3>
                <p className="whitespace-pre-wrap text-slate-400">{job.requirements}</p>
              </div>
            )}
            {job.duration && (
              <div className="surface-card-muted p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Duration
                </h3>
                <p className="text-slate-400">{job.duration}</p>
              </div>
            )}
            {job.compensation && (
              <div className="surface-card-muted p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  Compensation
                </h3>
                <p className="text-slate-400">{job.compensation}</p>
              </div>
            )}
            {job.location && (
              <div className="surface-card-muted p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Location
                </h3>
                <p className="text-slate-400">{job.location}</p>
              </div>
            )}
            {job.teamSize && (
              <div className="surface-card-muted p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <Users className="w-4 h-4 text-blue-400" />
                  Team Size
                </h3>
                <p className="text-slate-400">{job.teamSize}</p>
              </div>
            )}
          </div>

          {Array.isArray(job.tags) && job.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-white">Skills and tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1 border-white/10 bg-slate-950 text-slate-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-white/10">
            <h3 className="font-semibold mb-4 text-white">Posted by</h3>
            <div className="flex items-center gap-4">
              {job.createdBy.avatarUrl ? (
                <img
                  src={job.createdBy.avatarUrl}
                  alt={job.createdBy.fullName || 'User'}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold border border-white/10"
                  style={{ background: '#1f2937' }}
                >
                  {job.createdBy.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <p className="font-bold text-lg text-slate-200">{job.createdBy.fullName || 'Anonymous'}</p>
                <p className="text-sm text-slate-400 font-medium">
                  {job.createdBy.department && job.createdBy.year ? `${job.createdBy.department} • Year ${job.createdBy.year}` : job.createdBy.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="surface-card p-5">
              <h3 className="font-semibold text-white mb-4">Quick facts</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Applications</span>
                  <span className="font-semibold">{job._count.applications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Views</span>
                  <span className="font-semibold">{job.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Type</span>
                  <span className="font-semibold">{JOB_TYPE_LABELS[job.type] || job.type}</span>
                </div>
              </div>
            </div>

            {job.isPaid && job.paymentAmount && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs uppercase tracking-wider font-bold text-emerald-400/80">Compensation</p>
                    <p className="text-xl font-semibold text-emerald-300">${job.paymentAmount.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            )}

            {!isOwner && !hasApplied && !job.isFilled && (
              <Button
                onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
              >
                Apply now
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </aside>
      </div>

      {!isOwner && (
        <div className="surface-card p-6 md:p-8 border-emerald-500/25">
          <div className="text-center mb-6">
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <span className="text-4xl" aria-hidden>
                🎯
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Calculate Your Match Score
                </h2>
                <Badge className="bg-emerald-600 text-white border-0 px-3 py-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Analysis
                </Badge>
              </div>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              See how well YOUR profile matches this specific job using real AI analysis based on your skills and experience!
            </p>
          </div>
          <div className="flex justify-center">
            <CalculateMyMatchButton jobId={job.id} jobTitle={job.title} />
          </div>
        </div>
      )}

      {!isOwner && (
        <div className="space-y-6">
          <div className="surface-card p-6 md:p-8">
            {hasApplied ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Application Submitted
                </h3>
                <p className="text-slate-400 mb-6">
                  {userApplication && (
                    <>You applied on {new Date(userApplication.createdAt).toLocaleDateString()}</>
                  )}
                </p>
                {userApplication && (
                  <Badge className={`text-sm px-4 py-1.5 ${APPLICATION_STATUS_COLORS[userApplication.status]}`}>
                    {userApplication.status}
                  </Badge>
                )}
              </div>
            ) : job.isFilled ? (
              <div className="text-center py-8">
                <XCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-white">
                  Position Filled
                </h3>
                <p className="text-slate-400 text-lg">
                  This opportunity is no longer accepting applications
                </p>
              </div>
            ) : (
              <div className="space-y-8" id="apply-section">
                <div className="surface-card-muted p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl" aria-hidden>
                        🤖
                      </span>
                      <h3 className="font-semibold text-xl text-white">AI Application Tools</h3>
                      <Badge className="bg-blue-500 text-white border-0">New</Badge>
                    </div>
                    <p className="text-slate-300 mb-6">
                      Use our cutting-edge AI tools to prepare your application and ace the interview!
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <AICoverLetterGenerator jobId={job.id} jobTitle={job.title} />
                      <AIInterviewTips jobId={job.id} jobTitle={job.title} />
                    </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-2xl font-semibold mb-6 text-white">
                    Apply for this Opportunity
                  </h3>
                  <ApplicationForm
                    jobId={job.id}
                    jobTitle={job.title}
                    isPaid={job.isPaid}
                    paymentAmount={job.paymentAmount}
                    paymentCurrency={job.paymentCurrency}
                    onSuccess={handleApplicationSuccess}
                  />
                </div>
              </div>
            )}
          </div>

          {hasApplied && !job.isFilled && (
            <div className="surface-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Schedule a Video Interview
                </h3>
                <p className="text-slate-400">
                  Request a video call with the job poster to discuss this opportunity
                </p>
              </div>
              <RequestVideoCallButton
                jobId={job.id}
                jobTitle={job.title}
                jobPosterId={job.createdById}
                applicationId={userApplication?.id}
                currentUserId={currentProfile.id}
                existingRequest={existingCallRequest}
              />
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="space-y-6">
          <div className="surface-card p-6 md:p-8">
            <div className="text-center mb-8">
              <p className="text-xl font-semibold mb-2 text-white">
                This is your job posting
              </p>
              <p className="text-slate-400">
                {job.applications.length} {job.applications.length === 1 ? 'application' : 'applications'} received
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => router.push(`/jobs/${job.id}/applications`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl text-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                View All Applications ({job.applications.length})
              </Button>
              <Button
                onClick={() => router.push(`/my-jobs`)}
                variant="outline"
                className="border-white/20 hover:bg-white/5 text-white font-semibold py-6 px-8 rounded-xl text-lg"
              >
                Manage Job
              </Button>
            </div>
          </div>

          {job.isPublished && !job.isDraft && (
            <div className="surface-card p-6 md:p-8">
              <JobPaymentButton
                jobId={job.id}
                currentPaymentAmount={job.paymentAmount}
                isPaid={job.isPaid}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
