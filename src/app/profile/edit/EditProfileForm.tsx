'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Loader2, X, Plus, User as UserIcon } from 'lucide-react'
import { FileUpload } from '@/components/FileUpload'
import { useAuth } from '@/contexts/AuthContext'

interface EditProfileFormProps {
  profile: Profile
}

const DEPARTMENTS = [
  'Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering',
  'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Management Sciences',
  'Economics', 'Finance', 'Marketing', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Psychology', 'Sociology', 'Political Science', 'Media Studies', 'Architecture', 'Design', 'Other'
]

const YEARS = ['1', '2', '3', '4', 'Graduate', 'PhD']

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter()
  const { refreshProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [fullName, setFullName] = useState(profile.fullName || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [department, setDepartment] = useState(profile.department || '')
  const [year, setYear] = useState(profile.year || '')
  const [skills, setSkills] = useState<string[]>(profile.skills || [])
  const [interests, setInterests] = useState<string[]>(profile.interests || [])
  const [newSkill, setNewSkill] = useState('')
  const [newInterest, setNewInterest] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '')

  const addToken = (
    value: string,
    setValue: (next: string) => void,
    list: string[],
    setList: (next: string[]) => void,
    type: 'skill' | 'interest'
  ) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (trimmed.length > 50) {
      setError(`${type === 'skill' ? 'Skill' : 'Interest'} is too long (max 50 characters)`)
      return
    }
    if (list.length >= 20) {
      setError(`Maximum 20 ${type}s allowed`)
      return
    }
    if (list.includes(trimmed)) {
      setError(`This ${type} already exists`)
      return
    }

    setList([...list, trimmed])
    setValue('')
    setError('')
  }

  const removeToken = (token: string, list: string[], setList: (next: string[]) => void) => {
    setList(list.filter(item => item !== token))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

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
      setTimeout(() => router.push('/profile'), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="surface-card p-6 md:p-8">
        <div className="section-header">
          <div>
            <button
              onClick={() => router.push('/profile')}
              className="focus-ring mb-3 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to profile
            </button>
            <h1 className="section-title">Edit Profile</h1>
            <p className="section-subtitle">Update your information for better matching and visibility.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="focus-ring px-4 py-2 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-white/5"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              form="edit-profile-form"
              type="submit"
              disabled={isSubmitting}
              className="focus-ring px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold inline-flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        </div>

        <form id="edit-profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="surface-card-muted p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Profile Photo</h3>
              <div className="flex justify-center mb-4">
                {avatarUrl ? (
                  <div className="relative">
                    <img src={avatarUrl} alt="Avatar Preview" className="h-36 w-36 rounded-xl object-cover border border-white/10" />
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-500 text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-36 w-36 rounded-xl bg-slate-900 border border-dashed border-white/15 text-slate-500 flex items-center justify-center">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
              </div>
              <FileUpload category="AVATAR" maxFiles={1} onUploadComplete={(url) => setAvatarUrl(url)} />
            </div>

            <div className="surface-card-muted p-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 w-full h-11 rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-white"
                >
                  <option value="">Select</option>
                  {DEPARTMENTS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1 w-full h-11 rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-white"
                >
                  <option value="">Select</option>
                  {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="surface-card-muted p-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 bg-slate-950/60 border-white/10 text-white"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wide text-slate-500">Bio</label>
                  <span className="text-xs text-slate-500">{bio.length}/500</span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  className="mt-1 w-full min-h-[140px] rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-white placeholder:text-slate-600"
                  placeholder="Short summary about your experience, goals, and strengths."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-card-muted p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToken(newSkill, setNewSkill, skills, setSkills, 'skill'))}
                    className="bg-slate-950/60 border-white/10 text-white"
                    placeholder="Add skill"
                  />
                  <button type="button" onClick={() => addToken(newSkill, setNewSkill, skills, setSkills, 'skill')} className="focus-ring px-3 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                      {skill}
                      <button type="button" onClick={() => removeToken(skill, skills, setSkills)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="surface-card-muted p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Interests</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToken(newInterest, setNewInterest, interests, setInterests, 'interest'))}
                    className="bg-slate-950/60 border-white/10 text-white"
                    placeholder="Add interest"
                  />
                  <button type="button" onClick={() => addToken(newInterest, setNewInterest, interests, setInterests, 'interest')} className="focus-ring px-3 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span key={interest} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {interest}
                      <button type="button" onClick={() => removeToken(interest, interests, setInterests)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                Profile updated successfully. Redirecting...
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
