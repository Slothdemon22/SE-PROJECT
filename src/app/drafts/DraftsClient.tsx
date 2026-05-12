'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Job } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import gsap from 'gsap'
import {
  FileText,
  Edit,
  Trash2,
  Send,
  Calendar,
  Plus,
} from 'lucide-react'

interface DraftsClientProps {
  drafts: Job[]
}

const JOB_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_PROJECT: 'Academic Project',
  STARTUP_COLLABORATION: 'Startup/Collaboration',
  PART_TIME_JOB: 'Part-time Job',
  COMPETITION_HACKATHON: 'Competition/Hackathon',
}

export function DraftsClient({ drafts }: DraftsClientProps) {
  const router = useRouter()
  const toast = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.draft-card')
      gsap.fromTo(elements, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: "auto" }
      )
    }
  }, [drafts])

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return
    }

    setDeletingId(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete draft')
      }

      toast.success('Draft deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete draft. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handlePublish = async (jobId: string) => {
    if (!confirm('Publish this job? It will be sent for admin approval.')) {
      return
    }

    setPublishingId(jobId)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDraft: false,
          status: 'PENDING', // Reset to pending for admin approval
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish draft')
      }

      router.refresh()
      toast.success('Draft published and sent for approval')
    } catch (error) {
      toast.error('Failed to publish draft. Please try again.')
    } finally {
      setPublishingId(null)
    }
  }

  return (
    <div className="space-y-6 text-slate-100" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="text-center md:text-left">
          <h1
            className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
          >
            Draft Jobs
          </h1>
          <p className="text-lg text-slate-400">
            Your unpublished job postings ({drafts.length})
          </p>
        </div>
        <Button onClick={() => router.push('/jobs/create')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-2xl shadow-lg shadow-blue-500/20 text-lg">
          <Plus className="w-5 h-5 mr-2" />
          Create New Job
        </Button>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-lg w-full max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">
            No drafts yet
          </h3>
          <p className="mb-8 text-slate-400 text-lg">
            Start creating a job posting and save it as a draft
          </p>
          <Button onClick={() => router.push('/jobs/create')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-blue-500/20">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Draft
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {drafts.map((draft) => (
            <div key={draft.id} className="draft-card bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Left: Draft Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-white hover:text-blue-400 transition-colors leading-tight">
                      {draft.title}
                    </h3>
                    <Badge className="bg-slate-800 text-slate-300 border-white/10 px-3 py-1">
                      Draft
                    </Badge>
                    <Badge variant="outline" className="border-white/10 bg-slate-950 text-slate-300 px-3 py-1">
                      {JOB_TYPE_LABELS[draft.type]}
                    </Badge>
                  </div>

                  <p className="text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {draft.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      Last edited {new Date(draft.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap md:flex-col gap-3 w-full md:w-auto min-w-[160px]">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/jobs/${draft.id}/edit`)}
                    className="flex-1 bg-slate-950/50 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl py-5"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => handlePublish(draft.id)}
                    disabled={publishingId === draft.id}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-5 shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {publishingId === draft.id ? 'Publishing...' : 'Publish'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDelete(draft.id)}
                    disabled={deletingId === draft.id}
                    className="flex-1 bg-rose-500/5 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl py-5"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletingId === draft.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
