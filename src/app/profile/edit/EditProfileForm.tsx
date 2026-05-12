'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Loader2, X, Plus, User as UserIcon } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'
import { useAuth } from '@/contexts/AuthContext'

interface EditProfileFormProps {
  profile: Profile
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter()
  const { refreshProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form state
  const [fullName, setFullName] = useState(profile.fullName || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [department, setDepartment] = useState(profile.department || '')
  const [year, setYear] = useState(profile.year || '')
  const [skills, setSkills] = useState<string[]>(profile.skills || [])
  const [interests, setInterests] = useState<string[]>(profile.interests || [])
  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '')

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim()
    
    if (!trimmedSkill) return
    
    if (trimmedSkill.length > 50) {
      setError('Skill name too long (max 50 characters)')
      return
    }
    
    if (skills.length >= 20) {
      setError('Maximum 20 skills allowed')
      return
    }
    
    if (skills.includes(trimmedSkill)) {
      setError('This skill already exists')
      return
    }
    
    setSkills([...skills, trimmedSkill])
    setNewSkill('')
    setError('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim()
    
    if (!trimmedInterest) return
    
    if (trimmedInterest.length > 50) {
      setError('Interest name too long (max 50 characters)')
      return
    }
    
    if (interests.length >= 20) {
      setError('Maximum 20 interests allowed')
      return
    }
    
    if (interests.includes(trimmedInterest)) {
      setError('This interest already exists')
      return
    }
    
    setInterests([...interests, trimmedInterest])
    setNewInterest('')
    setError('')
  }

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    // Comprehensive Validation
    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters')
      setIsSubmitting(false)
      return
    }

    if (fullName.trim().length > 100) {
      setError('Full name must be less than 100 characters')
      setIsSubmitting(false)
      return
    }

    if (!/^[a-zA-Z\s'-]+$/.test(fullName.trim())) {
      setError('Full name can only contain letters, spaces, hyphens and apostrophes')
      setIsSubmitting(false)
      return
    }

    if (bio.length > 500) {
      setError('Bio must be less than 500 characters')
      setIsSubmitting(false)
      return
    }

    if (skills.length > 20) {
      setError('Maximum 20 skills allowed')
      setIsSubmitting(false)
      return
    }

    if (interests.length > 20) {
      setError('Maximum 20 interests allowed')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          bio,
          department,
          year,
          skills,
          interests,
          avatarUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess(true)
      await refreshProfile()
      router.refresh()
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1800px] mx-auto space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-6 md:px-12 lg:px-20 py-16">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 pb-12 border-b border-white/5">
        <div className="space-y-6">
          <button
            onClick={() => router.push('/profile')}
            className="group inline-flex items-center gap-3 text-slate-500 hover:text-blue-400 transition-all text-[11px] font-black uppercase tracking-[0.3em]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Executive Dashboard / Identity
          </button>

          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            Refine Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">Professional Persona</span>
          </h1>
          <p className="text-2xl text-slate-400 max-w-4xl font-medium leading-relaxed opacity-80">
            Meticulously curate your digital identity to align with elite opportunities and global strategic partnerships.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
           <button
            type="button"
            onClick={() => router.push('/profile')}
            disabled={isSubmitting}
            className="px-10 py-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:text-white hover:border-white/20 transition-all active:scale-95"
          >
            Discard Changes
          </button>
          <button
            form="edit-profile-form"
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Synchronizing Assets...</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                <span>Save Persona</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="edit-profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 space-y-16">
          {/* Avatar Section */}
          <div className="p-12 bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-12">
              <div className="text-center space-y-3">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Avatar Asset</h3>
                <p className="text-xs text-slate-400 font-semibold opacity-60">High-resolution professional headshot</p>
              </div>
              
              <div className="relative group/avatar">
                {avatarUrl ? (
                  <div className="relative">
                    <div className="absolute -inset-6 bg-blue-500/20 rounded-[4rem] blur-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-1000" />
                    <img
                      src={avatarUrl}
                      alt="Avatar Preview"
                      className="h-80 w-80 rounded-[4rem] object-cover border-4 border-slate-800 shadow-2xl transition-all duration-1000 group-hover/avatar:scale-[1.08] relative z-10"
                    />
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="absolute -top-4 -right-4 p-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-2xl transition-all transform hover:scale-110 active:scale-90 z-20"
                    >
                      <X className="w-6 h-6" strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <div className="h-80 w-80 rounded-[4rem] bg-slate-950/60 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/10 transition-all duration-700 group-hover/avatar:border-blue-500/40 group-hover/avatar:bg-slate-950/30">
                    <UserIcon className="w-32 h-32 mb-6 opacity-10" />
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-30">Null Asset</p>
                  </div>
                )}
              </div>
              
              <div className="w-full">
                <FileUpload
                  category="AVATAR"
                  maxFiles={1}
                  onUploadComplete={(url) => setAvatarUrl(url)}
                />
              </div>
            </div>
          </div>

          {/* Quick Academic Profile */}
          <div className="p-12 bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl space-y-10">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Contextual Layer</h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-60">Primary Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="bg-slate-950/50 border border-white/5 text-white rounded-2xl w-full h-16 px-8 focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-sm font-bold tracking-tight"
                >
                  <option value="" disabled className="bg-slate-900">Select Domain</option>
                  {[
                    "Computer Science", "Software Engineering", "Information Technology",
                    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering",
                    "Business Administration", "Management Sciences", "Economics",
                    "Finance", "Marketing", "Mathematics", "Physics", "Chemistry",
                    "Biology", "English", "Psychology", "Sociology", "Political Science",
                    "Media Studies", "Architecture", "Design", "Other"
                  ].map(dept => (
                    <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 opacity-60">Academic Seniority</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-slate-950/50 border border-white/5 text-white rounded-2xl w-full h-16 px-8 focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-sm font-bold tracking-tight"
                >
                  <option value="" disabled className="bg-slate-900">Select Seniority</option>
                  <option value="1" className="bg-slate-900">Freshman (L1)</option>
                  <option value="2" className="bg-slate-900">Sophomore (L2)</option>
                  <option value="3" className="bg-slate-900">Junior (L3)</option>
                  <option value="4" className="bg-slate-900">Senior (L4)</option>
                  <option value="Graduate" className="bg-slate-900">Graduate (MSc)</option>
                  <option value="PhD" className="bg-slate-900">Doctoral (PhD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-8 space-y-16">
          {/* Identity Card */}
          <div className="p-12 bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl space-y-12">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Identity Core</h3>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="space-y-5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2 opacity-60">Legal & Professional Moniker *</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-950/50 border-white/5 text-white rounded-3xl h-20 px-10 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-800 text-2xl font-black tracking-tight"
                  placeholder="Enter your full professional moniker"
                  required
                />
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-60">Executive Narrative</label>
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
                    {bio.length} / 500
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-slate-950/50 border border-white/5 text-white rounded-[2.5rem] w-full min-h-[420px] p-12 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-800 leading-[1.6] font-bold text-xl tracking-tight"
                  placeholder="Articulate a compelling narrative of your unique professional trajectory and value proposition..."
                  maxLength={500}
                />
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Proficiencies */}
            <div className="p-12 bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl space-y-10">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Domain Proficiencies</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="bg-slate-950/50 border border-white/5 text-white rounded-2xl h-16 px-8 focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-bold tracking-tight"
                    placeholder="Index capability..."
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="w-16 h-16 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-2xl flex items-center justify-center transition-all active:scale-90"
                  >
                    <Plus className="w-7 h-7" strokeWidth={3} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 min-h-[160px] content-start">
                  {skills.length === 0 ? (
                    <div className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-20">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">No Capabilities Indexed</p>
                    </div>
                  ) : (
                    skills.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-blue-500/5 text-blue-400 border border-blue-500/10 px-6 py-3 rounded-2xl flex items-center gap-4 group/tag hover:bg-blue-500/10 transition-all cursor-default shadow-sm"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.1em]">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-400 transition-colors opacity-30 group-hover/tag:opacity-100"
                        >
                          <X className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Strategic Targets */}
            <div className="p-12 bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl space-y-10">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Strategic Targets</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    className="bg-slate-950/50 border border-white/5 text-white rounded-2xl h-16 px-8 focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold tracking-tight"
                    placeholder="Index target..."
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="w-16 h-16 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-2xl flex items-center justify-center transition-all active:scale-90"
                  >
                    <Plus className="w-7 h-7" strokeWidth={3} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 min-h-[160px] content-start">
                  {interests.length === 0 ? (
                    <div className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-20">
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">No Targets Indexed</p>
                    </div>
                  ) : (
                    interests.map((interest, index) => (
                      <div
                        key={index}
                        className="bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 px-6 py-3 rounded-2xl flex items-center gap-4 group/tag hover:bg-indigo-500/10 transition-all cursor-default shadow-sm"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.1em]">{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:text-rose-400 transition-colors opacity-30 group-hover/tag:opacity-100"
                        >
                          <X className="w-4 h-4" strokeWidth={3} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-8 pt-6">
            {error && (
              <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[3rem] text-rose-400 text-center animate-in fade-in zoom-in-95 backdrop-blur-md">
                <p className="text-sm font-black uppercase tracking-[0.3em]">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[4rem] text-emerald-400 flex items-center gap-10 animate-in fade-in slide-in-from-bottom-8 backdrop-blur-xl shadow-2xl">
                <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <Save className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="font-black uppercase tracking-[0.4em] text-sm">Persona Synchronized</p>
                  <p className="text-lg font-bold opacity-60 text-emerald-300/90 leading-relaxed">Your professional digital identity has been successfully curated and broadcast to the ecosystem.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

