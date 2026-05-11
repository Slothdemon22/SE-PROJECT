'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Trash2, Check, Loader2 } from 'lucide-react'
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
  onSuccess: () => void
}

export function ApplicationForm({ jobId, jobTitle, onSuccess }: ApplicationFormProps) {
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

        // Auto-select default resume
        const defaultResume = data.resumes.find((r: Resume) => r.isDefault)
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id)
        }
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoadingResumes(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file - Only DOCX and TXT for AI analysis
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/pdf', // Allow PDF but with limited functionality
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a DOCX, TXT, or PDF document')
      return
    }

    // Note: PDF files are now fully supported for AI analysis
    if (file.type === 'application/pdf') {
      // No warning needed
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

      // Show success message with storage location
      setSuccessMessage(
        `✅ ${data.message}\n📍 Storage: ${data.storageLocation || 'Supabase Storage'}\n🔗 URL: ${data.resume.publicUrl}`
      )

      // Refresh resumes list
      await fetchResumes()

      // Auto-select the newly uploaded resume
      setSelectedResumeId(data.resume.id)

      // Clear success message after 8 seconds
      setTimeout(() => setSuccessMessage(''), 8000)
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
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) +  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Proposal Section */}
      <div className="p-8 md:p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Strategic Proposal</h3>
              <p className="text-slate-400 font-medium text-sm">Quantify your impact and align your vision with the opportunity.</p>
            </div>
            <div className="shrink-0">
               <AICoverLetterGenerator jobId={jobId} jobTitle={jobTitle} />
            </div>
          </div>

          <div className="relative">
            <textarea
              className="w-full bg-slate-950/50 border border-white/5 text-white rounded-3xl min-h-[320px] p-8 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-700 leading-relaxed font-medium"
              placeholder="Craft your narrative here or use AI Intelligence to generate a high-conversion foundation..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-6 right-8 flex items-center gap-4">
               <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/5 backdrop-blur-md">
                 <span className={cn(
                   "text-[10px] font-black uppercase tracking-widest",
                   proposal.length >= 50 ? "text-blue-400" : "text-slate-500"
                 )}>
                   {proposal.length} Characters
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Section */}
      <div className="p-8 md:p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Professional Assets</h3>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Upload Area */}
          <div className="relative group">
            <input
              type="file"
              id="resume-upload"
              accept=".docx,.txt,.pdf"
              onChange={handleFileUpload}
              disabled={isUploading || isSubmitting}
              className="hidden"
            />
            <label
              htmlFor="resume-upload"
              className={cn(
                "flex flex-col items-center justify-center gap-4 p-10 rounded-[2rem] border-2 border-dashed transition-all duration-500 cursor-pointer",
                isUploading 
                  ? "bg-slate-950/20 border-white/5 opacity-50" 
                  : "bg-slate-950/40 border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 group"
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-500">
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
              </div>
              <div className="text-center">
                <p className="text-white font-black uppercase tracking-widest text-sm mb-1">
                  {isUploading ? 'Synchronizing Assets...' : 'Upload Executive Resume'}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
                  DOCX / TXT for AI Intelligence • PDF Supported (5MB)
                </p>
              </div>
            </label>
          </div>

          {/* Selection Area */}
          {resumes.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Asset Library</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="group/item relative">
                    <button
                      type="button"
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={cn(
                        "w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                        selectedResumeId === resume.id 
                          ? "bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/10" 
                          : "bg-slate-950/40 border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          selectedResumeId === resume.id ? "bg-blue-500 text-white" : "bg-slate-900 text-slate-500"
                        )}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{resume.fileName}</p>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            {formatFileSize(resume.fileSize)} • {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedResumeId === resume.id && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </button>
                    
                    {resume.publicUrl && (
                      <div className="absolute right-4 bottom-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <AnalyzeResumeButton
                          resumeId={resume.id}
                          fileName={resume.fileName}
                          fileUrl={resume.publicUrl}
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 hover:bg-transparent"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback & Submission */}
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <AlertDescription className="font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-emerald-400 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <Check className="w-5 h-5" strokeWidth={3} />
                </div>
                <pre className="whitespace-pre-wrap text-xs font-bold font-sans opacity-90 leading-relaxed">
                  {successMessage}
                </pre>
             </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !proposal.trim() || proposal.length < 50}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] h-20 text-xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Initializing Submission...</span>
            </>
          ) : (
            <>
              <span>Submit Strategic Application</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </>
          )}
        </button>
        
        <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          End-to-End Encryption • Direct Professional Routing
        </p>
      </div>
    </div>
  )
}

