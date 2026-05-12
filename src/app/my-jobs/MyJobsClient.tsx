'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Job } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import gsap from 'gsap'
import {
  Calendar,
  Eye,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit,
  RefreshCw,
  AlertCircle,
  Plus,
  Send,
  EyeOff,
  CheckCheck,
  Undo2,
} from 'lucide-react'

interface JobWithCount extends Job {
  _count: {
    applications: number
  }
}

interface MyJobsClientProps {
  jobs: JobWithCount[]
}

const JOB_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_PROJECT: 'Academic Project',
  STARTUP_COLLABORATION: 'Startup/Collaboration',
  PART_TIME_JOB: 'Part-time Job',
  COMPETITION_HACKATHON: 'Competition/Hackathon',
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  PENDING: {
    label: 'Pending Review',
    icon: Clock,
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
  },
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle2,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  REJECTED: {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  },
}

export function MyJobsClient({ jobs }: MyJobsClientProps) {
  const router = useRouter()
  const toast = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [resubmittingId, setResubmittingId] = useState<string | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [fillingId, setFillingId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.job-card')
      gsap.fromTo(elements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      )
    }
  }, [jobs])

  const handleDelete = async (jobId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    setDeletingId(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete job')
      }

      toast.success('Job deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete job. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleResubmit = async (jobId: string): Promise<void> => {
    setResubmittingId(jobId)
    try {
      // Reset job status to PENDING for re-review
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PENDING',
          rejectionReason: null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to resubmit job')
      }

      router.refresh()
      toast.success('Job resubmitted for review')
    } catch (error) {
      toast.error('Failed to resubmit job. Please try again.')
    } finally {
      setResubmittingId(null)
    }
  }

  const handleTogglePublish = async (jobId: string, currentlyPublished: boolean): Promise<void> => {
    setPublishingId(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !currentlyPublished,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update job')
      }

      toast.success(currentlyPublished ? 'Job unpublished successfully' : 'Job published successfully')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job. Please try again.')
    } finally {
      setPublishingId(null)
    }
  }

  const handleToggleFill = async (jobId: string, currentlyFilled: boolean): Promise<void> => {
    const action = currentlyFilled ? 'reopen' : 'mark as filled'
    if (!confirm(`Are you sure you want to ${action} this job?`)) {
      return
    }

    setFillingId(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}/fill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFilled: !currentlyFilled,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update job')
      }

      router.refresh()
      toast.success(data.message || (currentlyFilled ? 'Job reopened successfully' : 'Job marked as filled'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job. Please try again.')
    } finally {
      setFillingId(null)
    }
  }

  const pendingJobs = jobs.filter(job => job.status === 'PENDING')
  const approvedJobs = jobs.filter(job => job.status === 'APPROVED')
  const rejectedJobs = jobs.filter(job => job.status === 'REJECTED')
  const draftJobs = jobs.filter(job => job.isDraft)

  return (
    <div className="space-y-8 text-slate-100" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            My Job Postings
          </h1>
          <p className="text-lg text-slate-400">
            Manage your job postings and view applications
          </p>
        </div>
        <Button
          onClick={() => router.push('/jobs/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-2xl shadow-lg shadow-blue-500/20 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-yellow-500/10 p-6 rounded-3xl shadow-lg hover:border-yellow-500/30 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-yellow-500/10">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {pendingJobs.length}
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400 mt-1">
                Pending Review
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/10 p-6 rounded-3xl shadow-lg hover:border-emerald-500/30 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/10">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {approvedJobs.length}
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400 mt-1">
                Approved & Live
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-rose-500/10 p-6 rounded-3xl shadow-lg hover:border-rose-500/30 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-500/10">
              <XCircle className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {rejectedJobs.length}
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400 mt-1">
                Rejected
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-lg hover:border-blue-500/30 transition-colors">
          <div className="flex flex-col gap-3">
            <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {draftJobs.length}
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400 mt-1">
                Drafts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-lg w-full max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
            No job postings yet
          </h3>
          <p className="mb-8 text-slate-400 text-lg">
            Create your first job posting to start finding talented collaborators
          </p>
          <Button
            onClick={() => router.push('/jobs/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Job
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => {
            const StatusIcon = STATUS_CONFIG[job.status]?.icon || AlertCircle
            const statusColor = STATUS_CONFIG[job.status]?.color || 'bg-slate-800 text-slate-300'

            return (
              <div
                key={job.id}
                className="job-card bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left: Job Info */}
                  <div className="flex-1">
                    {/* Title and Status */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3
                        className="text-2xl font-bold flex-1 cursor-pointer text-white hover:text-blue-400 transition-colors leading-tight"
                        onClick={() => router.push(`/jobs/${job.id}`)}
                      >
                        {job.title}
                      </h3>
                      <Badge className={`${statusColor} px-3 py-1 font-medium`}>
                        <StatusIcon className="w-4 h-4 mr-1.5" />
                        {STATUS_CONFIG[job.status]?.label || job.status}
                      </Badge>
                      {job.isDraft && (
                        <Badge variant="outline" className="border-white/10 bg-slate-950 text-slate-300 px-3 py-1">Draft</Badge>
                      )}
                      {job.isFilled && (
                        <Badge className="bg-slate-800 text-slate-300 border-white/10 px-3 py-1">Position Filled</Badge>
                      )}
                    </div>

                    {/* Type */}
                    <Badge variant="outline" className="mb-4 border-white/10 bg-slate-950 text-slate-300 px-3 py-1.5">
                      {JOB_TYPE_LABELS[job.type]}
                    </Badge>

                    {/* Description */}
                    <p className="text-slate-400 leading-relaxed mb-6 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Rejection Reason */}
                    {job.status === 'REJECTED' && job.rejectionReason && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-rose-400 mb-1">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-rose-300">
                              {job.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Created {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      {job.isPublished && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-slate-500" />
                            {job.views} views
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-slate-500" />
                            {job._count.applications} applications
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-3 min-w-[200px]">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      className="flex-1 bg-slate-950/50 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl py-5"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>

                    {(job.status === 'APPROVED' || job._count.applications > 0) && (
                      <Button
                        onClick={() => router.push(`/jobs/${job.id}/applications`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-5 shadow-lg shadow-blue-500/20"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Applications ({job._count.applications})
                      </Button>
                    )}

                    {job.status === 'APPROVED' && (
                      <Button
                        variant="outline"
                        onClick={() => handleTogglePublish(job.id, job.isPublished)}
                        disabled={publishingId === job.id}
                        className="flex-1 bg-slate-950/50 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl py-5"
                      >
                        {job.isPublished ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            {publishingId === job.id ? 'Unpublishing...' : 'Unpublish'}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {publishingId === job.id ? 'Publishing...' : 'Publish'}
                          </>
                        )}
                      </Button>
                    )}

                    {job.status === 'APPROVED' && job.isPublished && (
                      <Button
                        variant="outline"
                        onClick={() => handleToggleFill(job.id, job.isFilled)}
                        disabled={fillingId === job.id}
                        className={`flex-1 rounded-xl py-5 ${job.isFilled ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
                      >
                        {job.isFilled ? (
                          <>
                            <Undo2 className="w-4 h-4 mr-2" />
                            {fillingId === job.id ? 'Reopening...' : 'Reopen'}
                          </>
                        ) : (
                          <>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            {fillingId === job.id ? 'Marking...' : 'Mark Filled'}
                          </>
                        )}
                      </Button>
                    )}

                    {job.status === 'REJECTED' && (
                      <Button
                        variant="outline"
                        onClick={() => handleResubmit(job.id)}
                        disabled={resubmittingId === job.id}
                        className="flex-1 bg-slate-950/50 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl py-5"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${resubmittingId === job.id ? 'animate-spin' : ''}`} />
                        {resubmittingId === job.id ? 'Submitting...' : 'Resubmit'}
                      </Button>
                    )}

                    {(job.status === 'PENDING' || job.isDraft) && (
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/jobs/${job.id}/edit`)}
                        className="flex-1 bg-slate-950/50 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl py-5"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="flex-1 bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl py-5"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deletingId === job.id ? 'Deleting...' : 'Delete'}
                    </Button>
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
