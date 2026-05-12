'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SkillsInput } from './SkillsInput';
import { InterestsInput } from './InterestsInput';
import { RoleSelector } from './RoleSelector';
import { AvatarUpload } from './AvatarUpload';
import { useToast } from '@/components/ui/toast';

interface CreateProfileFormProps {
  user: User;
}

export function CreateProfileForm({ user }: CreateProfileFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || '',
    email: user.email || '',
    avatarUrl: user.user_metadata?.avatar_url || 
               user.user_metadata?.picture || '',
    bio: '',
    skills: [] as string[],
    interests: [] as string[],
    role: 'SEEKER' as 'FINDER' | 'SEEKER',
    department: '',
    year: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Comprehensive Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (formData.fullName.trim().length > 100) {
      setError('Full name must be less than 100 characters');
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(formData.fullName.trim())) {
      setError('Full name can only contain letters, spaces, hyphens and apostrophes');
      setLoading(false);
      return;
    }

    if (formData.bio.length > 500) {
      setError('Bio must be less than 500 characters');
      setLoading(false);
      return;
    }

    if (formData.skills.length === 0) {
      setError('Please add at least one skill');
      setLoading(false);
      return;
    }

    if (formData.skills.length > 20) {
      setError('Maximum 20 skills allowed');
      setLoading(false);
      return;
    }

    // Validate each skill
    for (const skill of formData.skills) {
      if (skill.length > 50) {
        setError('Skill name too long (max 50 characters)');
        setLoading(false);
        return;
      }
    }

    if (formData.interests.length === 0) {
      setError('Please add at least one interest');
      setLoading(false);
      return;
    }

    if (formData.interests.length > 20) {
      setError('Maximum 20 interests allowed');
      setLoading(false);
      return;
    }

    // Validate each interest
    for (const interest of formData.interests) {
      if (interest.length > 50) {
        setError('Interest name too long (max 50 characters)');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      // Show success toast
      toast.success(`Profile created successfully! ${data.emailSent ? 'Welcome email sent!' : ''}`);
      
      // Success! Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const years = [
    'Freshman (1st Year)',
    'Sophomore (2nd Year)',
    'Junior (3rd Year)',
    'Senior (4th Year)',
    'Graduate Student',
    'PhD Candidate',
    'Alumni',
    'Faculty',
  ];

  const departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Design',
    'Sciences',
    'Arts & Humanities',
    'Medicine',
    'Law',
    'Education',
    'Other',
  ];

  return (
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          Step 1: Identity
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Craft Your <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Legacy</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Let's build a profile that stands out to the best opportunities in the ecosystem.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl animate-in fade-in slide-in-from-top-2 text-center">
            <p className="text-sm text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Section 1: Visual Identity */}
        <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl relative overflow-hidden group transition-all hover:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-10 relative z-10">Visual Presentation</h3>
          
          <div className="relative z-10">
             <AvatarUpload
              currentUrl={formData.avatarUrl}
              onUpload={(url: string) => updateField('avatarUrl', url)}
            />
          </div>
        </div>

        {/* Section 2: Personal Narrative */}
        <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl transition-all hover:border-white/10">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-10">Personal Narrative</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-300 ml-1">Full Identity *</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="How should the world know you?"
                className="bg-slate-950/50 border-white/5 text-white rounded-2xl h-14 px-6 focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-300 ml-1">Verified Email</Label>
              <Input
                value={formData.email}
                disabled
                className="bg-slate-950/30 border-white/5 text-slate-500 rounded-2xl h-14 px-6 opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2 space-y-3 pt-4">
              <div className="flex justify-between items-center px-1">
                <Label className="text-sm font-bold text-slate-300">Professional Bio</Label>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{formData.bio.length}/500</span>
              </div>
              <textarea
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell your story. What drives you? What's your unique edge?"
                className="bg-slate-950/50 border-white/5 text-white rounded-[2rem] w-full min-h-[160px] p-8 focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-700 leading-relaxed"
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Academic & Strategic Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl transition-all hover:border-white/10">
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Academic Standing</h3>
             <div className="space-y-6">
               <div className="space-y-3">
                 <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Primary Department</Label>
                 <select
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full bg-slate-950/50 border-white/5 text-white rounded-2xl h-14 px-6 focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select Department</option>
                  {departments.map(dept => <option key={dept} value={dept} className="bg-slate-900">{dept}</option>)}
                </select>
               </div>
               <div className="space-y-3">
                 <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Year</Label>
                 <select
                  value={formData.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  className="w-full bg-slate-950/50 border-white/5 text-white rounded-2xl h-14 px-6 focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select Year</option>
                  {years.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                </select>
               </div>
             </div>
          </div>

          <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl transition-all hover:border-white/10">
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Ecosystem Role</h3>
             <RoleSelector
                selectedRole={formData.role}
                onSelect={(role: 'FINDER' | 'SEEKER') => updateField('role', role)}
              />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-6 text-center italic">
                Fluid role: Switch anytime after onboarding
              </p>
          </div>
        </div>

        {/* Section 4: Expertise & Passions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl transition-all hover:border-white/10">
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Expert Skills *</h3>
             <SkillsInput
                skills={formData.skills}
                onChange={(skills: string[]) => updateField('skills', skills)}
              />
           </div>
           <div className="p-10 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl transition-all hover:border-white/10">
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Core Interests *</h3>
             <InterestsInput
                interests={formData.interests}
                onChange={(interests: string[]) => updateField('interests', interests)}
              />
           </div>
        </div>

        {/* Submit */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] h-20 text-xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Synchronizing Profile...</span>
              </>
            ) : (
              <>
                <span>Complete Profile Initialization</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

