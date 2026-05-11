'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Upload, Loader2, FileText, TrendingUp, AlertCircle, CheckCircle, X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeTipsResponse {
  overallScore: number
  experienceLevel: string
  yearsOfExperience: number
  professionalSummary: string
  detectedSkills: string[]
  strengths: string[]
  improvements: string[]
  suggestedJobTitles: string[]
  keyAchievements: string[]
  education: string
  professionalBackground: string
  formattingTips: string[]
  contentTips: string[]
  industryInsights: string[]
}

export default function ResumeTipsClient() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResumeTipsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file type
      const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
      ]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOCX, or TXT file')
        return
      }

      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }

      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const analyzeResume = async (): Promise<void> => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/resumes/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    if (score >= 75) return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          Elite Career Intelligence
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          AI Resume <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Optimization</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Leverage world-class talent strategies to transform your resume into a high-conversion professional asset.
        </p>
      </div>

      {/* Upload Section */}
      <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Input</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Upload your executive summary or resume</p>
            </div>
          </div>

          <div className="relative group">
            <input
              type="file"
              id="resume-upload"
              accept=".docx,.pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <label
              htmlFor="resume-upload"
              className={cn(
                "flex flex-col items-center justify-center gap-6 p-16 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 cursor-pointer",
                loading 
                  ? "bg-slate-950/20 border-white/5 opacity-50" 
                  : "bg-slate-950/40 border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5"
              )}
            >
              <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-500">
                <FileText className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-black uppercase tracking-[0.2em] text-lg">
                  {file ? file.name : 'Select Professional Asset'}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  PDF, DOCX, or TXT • Max 5MB
                </p>
              </div>
            </label>
          </div>

          {error && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-rose-400 text-center animate-in fade-in zoom-in-95">
              <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button
            onClick={analyzeResume}
            disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] h-20 text-xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Generating Intelligence...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6" />
                <span>Execute AI Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {/* Executive Summary & Score */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Asset Score</h3>
              <div className={cn("w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-700", getScoreColor(result.overallScore))}>
                <span className="text-5xl font-black">{result.overallScore}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Percentile</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {result.experienceLevel}
                </Badge>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {result.yearsOfExperience} Years
                </Badge>
              </div>
            </div>

            <div className="md:col-span-2 p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Executive Summary</h3>
              <p className="text-lg text-white font-medium leading-relaxed italic opacity-90">
                "{result.professionalSummary}"
              </p>
              <div className="pt-6 border-t border-white/5">
                 <div className="flex flex-wrap gap-2">
                    {result.detectedSkills?.slice(0, 8).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-white/5">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-xl rounded-[3rem] shadow-2xl space-y-8">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Strategic Strengths</h3>
              </div>
              <ul className="space-y-4">
                {result.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-emerald-100/80 font-medium leading-tight">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 bg-amber-500/5 border border-amber-500/10 backdrop-blur-xl rounded-[3rem] shadow-2xl space-y-8">
              <div className="flex items-center gap-3 text-amber-400">
                <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Evolution Vectors</h3>
              </div>
              <ul className="space-y-4">
                {result.improvements?.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-amber-100/80 font-medium leading-tight">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deep Insights */}
          <div className="grid md:grid-cols-3 gap-8">
             <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Formatting Excellence</h3>
                <ul className="space-y-3">
                  {result.formattingTips?.slice(0, 3).map((tip, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 font-bold uppercase tracking-tight flex gap-2">
                      <span className="text-blue-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
             </div>
             <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Narrative Strategy</h3>
                <ul className="space-y-3">
                  {result.contentTips?.slice(0, 3).map((tip, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 font-bold uppercase tracking-tight flex gap-2">
                      <span className="text-indigo-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
             </div>
             <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] space-y-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Industry Insights</h3>
                <ul className="space-y-3">
                  {result.industryInsights?.slice(0, 3).map((insight, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 font-bold uppercase tracking-tight flex gap-2">
                      <span className="text-purple-500">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* Suggested Progression */}
          <div className="p-10 bg-linear-to-r from-blue-600/10 to-indigo-600/10 border border-white/5 rounded-[3rem] space-y-8">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] text-center">Target Professional Pathing</h3>
             <div className="flex flex-wrap justify-center gap-3">
                {result.suggestedJobTitles?.map((title, idx) => (
                  <span key={idx} className="px-6 py-2 rounded-full bg-slate-950/50 border border-white/5 text-white text-xs font-black uppercase tracking-widest">
                    {title}
                  </span>
                ))}
             </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-8">
            <button
              onClick={() => {
                setFile(null)
                setResult(null)
                setError(null)
              }}
              className="px-10 py-4 bg-slate-900 border border-white/10 rounded-full text-slate-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white hover:border-white/20 transition-all active:scale-95"
            >
              Analyze Another Asset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

