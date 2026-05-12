'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send, X, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import AIJobRefiner from '@/components/AIJobRefiner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

const JOB_TYPES = [
  { value: 'ACADEMIC_PROJECT', label: 'Academic Project', description: 'Research, coursework, or academic collaborations' },
  { value: 'STARTUP_COLLABORATION', label: 'Startup/Collaboration', description: 'Join a startup or collaborative venture' },
  { value: 'PART_TIME_JOB', label: 'Part-time Job', description: 'Paid part-time work opportunities' },
  { value: 'COMPETITION_HACKATHON', label: 'Competition/Hackathon', description: 'Team formation for competitions and hackathons' },
]

const SUGGESTED_TAGS = [
  'React', 'Node.js', 'Python', 'AI/ML', 'Mobile App', 'Web Dev',
  'Data Science', 'UI/UX', 'Blockchain', 'IoT', 'Cloud', 'DevOps',
  'Research', 'Design', 'Marketing', 'Business', 'Remote', 'Paid'
]

interface TagsInputProps {
  tags: string
  onChange: (tags: string) => void
  onValidationError: (message: string) => void
}

function TagsInput({ tags, onChange, onValidationError }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

  const addTag = (tag: string): void => {
    const trimmedTag = tag.trim()
    
    if (!trimmedTag) return
    
    if (trimmedTag.length > 50) {
      onValidationError('Tag name too long (max 50 characters)')
      return
    }
    
    if (tagsArray.length >= 15) {
      onValidationError('Maximum 15 tags allowed')
      return
    }
    
    if (tagsArray.includes(trimmedTag)) {
      onValidationError('This tag already exists')
      return
    }
    
    const newTags = [...tagsArray, trimmedTag].join(', ')
    onChange(newTags)
    setInputValue('')
  }

  const removeTag = (tagToRemove: string): void => {
    const newTags = tagsArray.filter(t => t !== tagToRemove).join(', ')
    onChange(newTags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue.trim())
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter"
          className="flex-1 glass-input"
          maxLength={50}
        />
        <button
          type="button"
          onClick={() => addTag(inputValue.trim())}
          className="btn-gradient px-4 py-2 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Selected Tags */}
      {tagsArray.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagsArray.map((tag) => (
            <span
              key={tag}
              className="glass-card px-3 py-1 text-sm flex items-center gap-2"
              style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested Tags */}
      <div>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          Suggested tags (click to add):
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.filter(tag => !tagsArray.includes(tag)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="glass-card px-3 py-1 text-sm hover:shadow-md transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface CreateJobFormProps {
  profileId: string
}

export function CreateJobForm({ profileId }: CreateJobFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    requirements: '',
    duration: '',
    compensation: '',
    location: '',
    teamSize: '',
    tags: '',
  })

  const handleSubmit = async (isDraft: boolean) => {
    setError(null)
    setLoading(true)

    try {
      // Comprehensive Validation for published jobs
      if (!isDraft) {
        if (!formData.title.trim()) {
          setError('Job title is required')
          setLoading(false)
          return
        }

        if (formData.title.trim().length < 5) {
          setError('Title must be at least 5 characters')
          setLoading(false)
          return
        }

        if (formData.title.trim().length > 200) {
          setError('Title must be less than 200 characters')
          setLoading(false)
          return
        }

        if (!formData.type) {
          setError('Please select an opportunity type')
          setLoading(false)
          return
        }

        if (!formData.description.trim()) {
          setError('Description is required')
          setLoading(false)
          return
        }

        if (formData.description.trim().length < 50) {
          setError('Description must be at least 50 characters')
          setLoading(false)
          return
        }

        if (formData.description.trim().length > 5000) {
          setError('Description must be less than 5000 characters')
          setLoading(false)
          return
        }
      }

      // Validate optional fields
      if (formData.requirements && formData.requirements.length > 2000) {
        setError('Requirements must be less than 2000 characters')
        setLoading(false)
        return
      }

      if (formData.duration && formData.duration.length > 100) {
        setError('Duration must be less than 100 characters')
        setLoading(false)
        return
      }

      if (formData.compensation && formData.compensation.length > 200) {
        setError('Compensation must be less than 200 characters')
        setLoading(false)
        return
      }

      if (formData.location && formData.location.length > 100) {
        setError('Location must be less than 100 characters')
        setLoading(false)
        return
      }

      if (formData.teamSize && formData.teamSize.length > 100) {
        setError('Team size must be less than 100 characters')
        setLoading(false)
        return
      }

      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : []

      if (tagsArray.length > 15) {
        setError('Maximum 15 tags allowed')
        setLoading(false)
        return
      }

      // Validate each tag length
      for (const tag of tagsArray) {
        if (tag.length > 50) {
          setError('Tag name too long (max 50 characters)')
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          isDraft,
          profileId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job')
      }

      // Redirect based on draft status
      if (isDraft) {
        router.push('/drafts')
      } else {
        router.push(`/jobs/${data.job.id}`)
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAIResult = (result: any): void => {
    setFormData({
      ...formData,
      title: result.title,
      description: result.description,
      requirements: result.requirements,
      duration: result.duration,
      teamSize: result.teamSize,
      compensation: result.compensation,
      tags: result.suggestedTags.join(', '),
    })
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-3">
            Launch an <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Opportunity</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl font-medium">
            Connect with elite student talent by crafting a high-impact job posting.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="border-white/10 bg-slate-900/40 text-white hover:bg-slate-800 rounded-2xl px-6 py-6 font-bold"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-8 py-6 shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
            Publish Now
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {/* AI Intelligence Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <Card className="relative p-8 md:p-12 bg-slate-950/80 border-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24 text-blue-400" />
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">AI Intelligence Suite</h2>
              <p className="text-slate-400 font-medium">Instantly generate or refine your posting for maximum impact.</p>
            </div>
          </div>

          <AIJobRefiner
            role={formData.title}
            currentDescription={formData.description}
            currentRequirements={formData.requirements}
            duration={formData.duration}
            compensation={formData.compensation}
            type={formData.type}
            onApply={handleAIResult}
          />
          
          <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
             <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
               <span className="text-[10px] font-black">i</span>
             </div>
             <p className="text-xs text-blue-300/80 font-medium leading-relaxed">
               <strong>Pro Tip:</strong> Enter a target role (e.g., "Fullstack Engineer") and use <strong>Generate from Role</strong> for a complete professional template.
             </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Core Information */}
          <Card className="p-8 bg-slate-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Core Opportunity Details</h3>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 ml-1">Official Opportunity Title *</label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Lead Technical Architect - Fintech Disruptor"
                  className="bg-slate-950/50 border-white/5 text-white rounded-2xl h-14 px-6 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-300 ml-1">Opportunity Vector *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {JOB_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateField('type', type.value)}
                      className={cn(
                        "p-5 text-left rounded-2xl border transition-all duration-300 group/type",
                        formData.type === type.value 
                          ? "bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/10" 
                          : "bg-slate-950/50 border-white/5 hover:border-white/10"
                      )}
                    >
                      <h4 className={cn(
                        "font-black text-sm uppercase tracking-wider mb-2 transition-colors",
                        formData.type === type.value ? "text-blue-400" : "text-slate-300"
                      )}>
                        {type.label}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium group-hover/type:text-slate-400 transition-colors">
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-slate-300">Detailed Vision *</label>
                  <span className="text-[10px] font-black text-slate-600 uppercase">
                    {formData.description.length}/5000
                  </span>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="bg-slate-950/50 border-white/5 text-white rounded-3xl w-full min-h-[240px] p-8 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-600 leading-relaxed"
                  placeholder="Describe the mission, the impact, and the journey..."
                  required
                />
              </div>
            </div>
          </Card>

          {/* Strategic Requirements */}
          <Card className="p-8 bg-slate-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Surgical Requirements</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-300">Technical & Soft Skills</label>
                <span className="text-[10px] font-black text-slate-600 uppercase">
                  {formData.requirements.length}/2000
                </span>
              </div>
              <textarea
                value={formData.requirements}
                onChange={(e) => updateField('requirements', e.target.value)}
                className="bg-slate-950/50 border-white/5 text-white rounded-3xl w-full min-h-[160px] p-8 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-600"
                placeholder="List the essential skills and outcome-oriented requirements..."
              />
            </div>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-8">
          {/* Logistics */}
          <Card className="p-8 bg-slate-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Operational Logistics</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Timeline</label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                  className="bg-slate-950/50 border-white/5 text-white rounded-xl h-12 px-4 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. 3 Months"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Compensation</label>
                <Input
                  type="text"
                  value={formData.compensation}
                  onChange={(e) => updateField('compensation', e.target.value)}
                  className="bg-slate-950/50 border-white/5 text-white rounded-xl h-12 px-4 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Unpaid / $500 p/m"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Location Strategy</label>
                <select
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="bg-slate-950/50 border-white/5 text-white rounded-xl w-full h-12 px-4 focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select Location</option>
                  <option value="Remote" className="bg-slate-900">100% Remote</option>
                  <option value="On-campus" className="bg-slate-900">On-campus Only</option>
                  <option value="Hybrid" className="bg-slate-900">Hybrid Model</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Team Dynamics</label>
                <Input
                  type="text"
                  value={formData.teamSize}
                  onChange={(e) => updateField('teamSize', e.target.value)}
                  className="bg-slate-950/50 border-white/5 text-white rounded-xl h-12 px-4 focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. 3-4 Researchers"
                />
              </div>
            </div>
          </Card>

          {/* Searchability */}
          <Card className="p-8 bg-slate-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Strategic Tags</h3>
            <TagsInput
              tags={formData.tags}
              onChange={(tags: string) => updateField('tags', tags)}
              onValidationError={(message: string) => toast.warning(message)}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

