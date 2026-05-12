'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, ArrowRight, Check, UserRound, GraduationCap, Sparkles, ClipboardCheck, ChevronDown, BookOpenText, CalendarDays } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SkillsInput } from './SkillsInput';
import { InterestsInput } from './InterestsInput';
import { RoleSelector } from './RoleSelector';
import { AvatarUpload } from './AvatarUpload';
import { useToast } from '@/components/ui/toast';

interface CreateProfileFormProps {
  user: User;
}

type FormState = {
  fullName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  interests: string[];
  role: 'FINDER' | 'SEEKER';
  department: string;
  year: string;
};

const STEPS = [
  { id: 0, title: 'About You', icon: UserRound },
  { id: 1, title: 'Academic & Role', icon: GraduationCap },
  { id: 2, title: 'Skills & Interests', icon: Sparkles },
  { id: 3, title: 'Review', icon: ClipboardCheck },
] as const;

interface AcademicSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon: React.ComponentType<{ className?: string }>;
}

function AcademicSelect({ label, placeholder, value, onChange, options, icon: Icon }: AcademicSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</Label>
      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-blue-300 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 pl-10 pr-10 text-sm font-medium text-slate-100 shadow-inner shadow-black/20 transition focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="" className="bg-slate-900 text-slate-400">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-900 text-slate-100">
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 group-focus-within:text-blue-300 transition-colors">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function CreateProfileForm({ user }: CreateProfileFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<FormState>({
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

  const validateStep = (step: number): string | null => {
    if (step === 0) {
      if (!formData.fullName.trim()) return 'Full name is required';
      if (formData.fullName.trim().length < 2) return 'Full name must be at least 2 characters';
      if (formData.fullName.trim().length > 100) return 'Full name must be less than 100 characters';
      if (!/^[a-zA-Z\s'-]+$/.test(formData.fullName.trim())) {
        return 'Full name can only contain letters, spaces, hyphens and apostrophes';
      }
      if (formData.bio.length > 500) return 'Bio must be less than 500 characters';
    }

    if (step === 2) {
      if (formData.skills.length === 0) return 'Please add at least one skill';
      if (formData.skills.length > 20) return 'Maximum 20 skills allowed';
      for (const skill of formData.skills) {
        if (skill.length > 50) return 'Skill name too long (max 50 characters)';
      }

      if (formData.interests.length === 0) return 'Please add at least one interest';
      if (formData.interests.length > 20) return 'Maximum 20 interests allowed';
      for (const interest of formData.interests) {
        if (interest.length > 50) return 'Interest name too long (max 50 characters)';
      }
    }

    return null;
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateStep(0) || validateStep(2);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

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

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="surface-card p-5 md:p-6">
        <div className="section-header mb-0">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-300 mb-1">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <h1 className="section-title">Create Your Profile</h1>
            <p className="section-subtitle">A focused setup to improve matching and visibility.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div
              key={step.id}
              className={`rounded-xl border p-3.5 transition-colors ${
                isActive
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-white/10 bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-bold">
                <div className={`p-1.5 rounded-lg ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={isActive || isCompleted ? 'text-white' : 'text-slate-400'}>{step.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-sm text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Step 1 */}
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Profile Photo</h3>
              <AvatarUpload
                currentUrl={formData.avatarUrl}
                onUpload={(url: string) => updateField('avatarUrl', url)}
              />
            </div>

            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-300">Full Name *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Your full name"
                    className="bg-slate-950/50 border-white/10 text-white rounded-lg h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-300">Email</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="bg-slate-950/30 border-white/10 text-slate-500 rounded-lg h-11 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold text-slate-300">Short Bio</Label>
                  <span className="text-xs text-slate-500">{formData.bio.length}/500</span>
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="A short intro about your goals and strengths"
                  className="w-full min-h-[140px] p-4 bg-slate-950/50 border border-white/10 rounded-lg text-white placeholder:text-slate-600"
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Academic Details</h3>
              <div className="space-y-5">
                <AcademicSelect
                  label="Department"
                  placeholder="Select Department"
                  value={formData.department}
                  onChange={(value) => updateField('department', value)}
                  options={departments}
                  icon={BookOpenText}
                />

                <AcademicSelect
                  label="Current Year"
                  placeholder="Select Year"
                  value={formData.year}
                  onChange={(value) => updateField('year', value)}
                  options={years}
                  icon={CalendarDays}
                />
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Your Role</h3>
              <RoleSelector
                selectedRole={formData.role}
                onSelect={(role: 'FINDER' | 'SEEKER') => updateField('role', role)}
              />
              <p className="text-xs text-slate-500 mt-4">
                You can switch role mode anytime later.
              </p>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Skills *</h3>
              <SkillsInput
                skills={formData.skills}
                onChange={(skills: string[]) => updateField('skills', skills)}
              />
            </div>
            <div className="surface-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Interests *</h3>
              <InterestsInput
                interests={formData.interests}
                onChange={(interests: string[]) => updateField('interests', interests)}
              />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 3 && (
          <div className="surface-card p-6 space-y-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Review Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="surface-card-muted p-4">
                <p className="text-slate-500 mb-1">Name</p>
                <p className="text-white font-semibold">{formData.fullName || 'Not set'}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-slate-500 mb-1">Role</p>
                <p className="text-white font-semibold">{formData.role === 'SEEKER' ? 'Talent Seeker' : 'Talent Finder'}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-slate-500 mb-1">Department</p>
                <p className="text-white font-semibold">{formData.department || 'Not set'}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-slate-500 mb-1">Year</p>
                <p className="text-white font-semibold">{formData.year || 'Not set'}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-slate-500 mb-1">Skills</p>
                <p className="text-white font-semibold">{formData.skills.length} selected</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-slate-500 mb-1">Interests</p>
                <p className="text-white font-semibold">{formData.interests.length} selected</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            className="h-11 px-5 rounded-lg border border-white/10 text-slate-200 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  Create Profile
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

