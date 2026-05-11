'use client'

import { useState, useEffect, useRef } from 'react'
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
import gsap from 'gsap'
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
  Loader2,
  CreditCard,
  Sparkles,
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
  const containerRef = useRef<HTMLDivElement>(null)

  const isOwner = job.createdById === currentProfile.id
  const userApplication = Array.isArray(job.applications) && job.applications.length > 0 ? job.applications[0] : null
  const hasApplied = !!userApplication

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-on-load')
      gsap.fromTo(elements, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      )
    }
  }, [])

  const handleApplicationSuccess = (): void => {
    router.refresh()
  }

  return (
    <div className="space-y-6 text-slate-100" ref={containerRef}>
      {/* Back Button & Bookmark */}
      <div className="flex items-center justify-between animate-on-load">
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

      {/* Main Content Card */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl w-full relative overflow-hidden animate-on-load">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Header */}
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                {job.title}
              </h1>
              <Badge className={STATUS_COLORS[job.status] || ''}>
                {job.status}
              </Badge>
              {job.isDraft && (
                <Badge variant="outline" className="border-white/20 text-slate-300">Draft</Badge>
              )}
              {job.isFilled && (
                <Badge className="bg-slate-800 text-slate-300 border-white/10">Position Filled</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                {new Date(job.createdAt).toLocaleDateString()}
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

          <div className="flex flex-col items-end gap-3">
            <Badge
              className="text-sm px-4 py-2 border-0 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                color: 'white'
              }}
            >
              {JOB_TYPE_LABELS[job.type] || job.type}
            </Badge>

            {/* Payment Badge */}
            {job.isPaid && job.paymentAmount && (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-md">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-500/80">Compensation</div>
                  <div className="text-lg font-bold text-emerald-400">
                    ${job.paymentAmount.toFixed(0)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 relative">
          <h2 className="text-xl font-bold mb-4 text-white">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Job Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 relative">
          {job.requirements && (
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                Requirements
              </h3>
              <p className="whitespace-pre-wrap text-slate-400">
                {job.requirements}
              </p>
            </div>
          )}

          {job.duration && (
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-blue-400" />
                Duration
              </h3>
              <p className="text-slate-400">{job.duration}</p>
            </div>
          )}

          {job.compensation && (
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5 text-blue-400" />
                Compensation
              </h3>
              <p className="text-slate-400">{job.compensation}</p>
            </div>
          )}

          {job.location && (
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5 text-blue-400" />
                Location
              </h3>
              <p className="text-slate-400">{job.location}</p>
            </div>
          )}

          {job.teamSize && (
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-blue-400" />
                Team Size
              </h3>
              <p className="text-slate-400">{job.teamSize}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(job.tags) && job.tags.length > 0 && (
          <div className="mb-8 relative">
            <h3 className="font-bold mb-4 text-white">
              Skills & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-4 py-1.5 border-white/10 bg-slate-950 text-slate-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Posted By */}
        <div className="pt-8 border-t border-white/10 relative">
          <h3 className="font-bold mb-4 text-white">
            Posted By
          </h3>
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
                style={{ background: 'linear-gradient(135deg, #2563eb, #0ea5e9)' }}
              >
                {job.createdBy.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <p className="font-bold text-lg text-slate-200">
                {job.createdBy.fullName || 'Anonymous'}
              </p>
              <p className="text-sm text-slate-400 font-medium">
                {job.createdBy.department && job.createdBy.year
                  ? `${job.createdBy.department} • Year ${job.createdBy.year}`
                  : job.createdBy.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Match Score - PROMINENTLY DISPLAYED */}
      {!isOwner && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden animate-on-load">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-transparent pointer-events-none"></div>
          <div className="text-center mb-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <span className="text-6xl drop-shadow-lg">🎯</span>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">
                  Calculate Your Match Score
                </h2>
                <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 text-md px-4 py-1.5 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Analysis
                </Badge>
              </div>
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              See how well YOUR profile matches this specific job using real AI analysis based on your skills and experience!
            </p>
          </div>
          <div className="relative z-10 flex justify-center">
            <CalculateMyMatchButton jobId={job.id} jobTitle={job.title} />
          </div>
        </div>
      )}

      {/* Application Section */}
      {!isOwner && (
        <div className="space-y-6 animate-on-load">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
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
                  <Badge className={`text-lg px-6 py-2 ${APPLICATION_STATUS_COLORS[userApplication.status]}`}>
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
                {/* AI Tools Section */}
                <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">🤖</span>
                      <h3 className="font-bold text-xl text-white">AI Application Tools</h3>
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
                </div>

                {/* Application Form */}
                <div className="pt-4">
                  <h3 className="text-2xl font-bold mb-6 text-white">
                    Apply for this Opportunity
                  </h3>
                  <ApplicationForm
                    jobId={job.id}
                    jobTitle={job.title}
                    onSuccess={handleApplicationSuccess}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Video Call Request Button */}
          {hasApplied && !job.isFilled && (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
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

      {/* Owner Actions */}
      {isOwner && (
        <div className="space-y-6 animate-on-load">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
            <div className="text-center mb-8">
              <p className="text-xl font-bold mb-2 text-white">
                This is your job posting
              </p>
              <p className="text-slate-400">
                {job.applications.length} {job.applications.length === 1 ? 'application' : 'applications'} received
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => router.push(`/jobs/${job.id}/applications`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl text-lg shadow-lg shadow-blue-500/20"
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

          {/* Payment Section */}
          {job.isPublished && !job.isDraft && (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
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
