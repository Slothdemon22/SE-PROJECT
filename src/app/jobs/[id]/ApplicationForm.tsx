'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { FileText, Check, Loader2, CreditCard, Sparkles, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import AnalyzeResumeButton from '@/components/AnalyzeResumeButton'
import AICoverLetterGenerator from '@/components/AICoverLetterGenerator'

interface Resume {
  id: string
  fileName: string
  fileSize: number
  isDefault: boolean
  createdAt: string
  publicUrl?: string
}

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
  isPaid?: boolean
  paymentAmount?: number | null
  paymentCurrency?: string
  onSuccess: () => void
}

export function ApplicationForm({
  jobId,
  jobTitle,
  isPaid = false,
  paymentAmount = null,
  paymentCurrency = 'USD',
  onSuccess,
}: ApplicationFormProps) {
  const [proposal, setProposal] = useState('')
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loadingResumes, setLoadingResumes] = useState(true)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async (): Promise<void> => {
    try {
      const response = await fetch('/api/resumes')
      if (response.ok) {
        const data = await response.json()
        setResumes(data.resumes)

        const defaultResume = data.resumes.find((r: Resume) => r.isDefault)
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id)
        }
      }
    } catch (err) {
      console.error('Error fetching resumes:', err)
    } finally {
      setLoadingResumes(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/pdf',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a DOCX, TXT, or PDF document')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError('')
    setSuccessMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('setAsDefault', 'false')

      const response = await fetch('/api/resumes', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume')
      }

      setSuccessMessage(`${data.message}`)
      await fetchResumes()
      setSelectedResumeId(data.resume.id)

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    if (!proposal.trim()) {
      setError('Please write a proposal')
      return
    }

    if (proposal.trim().length < 50) {
      setError('Proposal must be at least 50 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          proposal: proposal.trim(),
          resumeId: selectedResumeId || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application')
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isPaid && paymentAmount ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-300">
                Stripe-Verified Visibility Boost
              </p>
              <p className="text-sm text-emerald-100">
                This role includes a visibility-backed compensation signal of{' '}
                <span className="font-semibold">
                  {paymentCurrency} {paymentAmount.toFixed(0)}
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="surface-card-muted p-5 space-y-4">
        <div className="section-header">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Step 1 of 2</p>
            <h3 className="text-base font-semibold text-white">Proposal</h3>
            <p className="text-sm text-slate-400">Explain your fit and expected impact for this role.</p>
          </div>
          <AICoverLetterGenerator jobId={jobId} jobTitle={jobTitle} />
        </div>

        <textarea
          className="w-full min-h-[220px] rounded-lg border border-white/10 bg-slate-950/60 p-4 text-sm text-white placeholder:text-slate-600"
          placeholder="Write a concise, role-specific proposal (minimum 50 characters)."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{proposal.length} characters</p>
          <p className="text-xs text-slate-500">Tip: mention 1-2 relevant projects and measurable outcomes.</p>
        </div>
      </div>

      <div className="surface-card-muted p-5 space-y-4">
        <div className="section-header">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Step 2 of 2</p>
            <h3 className="text-base font-semibold text-white">Resume</h3>
            <p className="text-sm text-slate-400">Upload a resume or choose one from your library.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            id="resume-upload"
            type="file"
            accept=".docx,.txt,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading || isSubmitting}
            className="bg-slate-950/60 border-white/10 text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white"
          />
          {isUploading && <Loader2 className="w-4 h-4 animate-spin text-blue-300" />}
        </div>

        {!loadingResumes && resumes.length > 0 && (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={cn(
                  'rounded-lg border px-3 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between',
                  selectedResumeId === resume.id
                    ? 'border-blue-500/40 bg-blue-500/10'
                    : 'border-white/10 bg-slate-950/40'
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelectedResumeId(resume.id)}
                  className="text-left flex items-center gap-3"
                >
                  <div className={cn('p-2 rounded-md', selectedResumeId === resume.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300')}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{resume.fileName}</p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(resume.fileSize)} • {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  {selectedResumeId === resume.id && <Check className="w-4 h-4 text-blue-300" />}
                  {resume.publicUrl && (
                    <AnalyzeResumeButton
                      resumeId={resume.id}
                      fileName={resume.fileName}
                      fileUrl={resume.publicUrl}
                      variant="ghost"
                      size="sm"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-200">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-300" />
          <p>
            Your application is submitted securely. You can track status updates from your applications dashboard.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !proposal.trim() || proposal.length < 50}
        className="focus-ring w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Application...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Submit Application
          </>
        )}
      </button>
    </form>
  )
}
