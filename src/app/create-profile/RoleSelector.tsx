'use client';

import { Briefcase, CheckCircle2, Search } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'FINDER' | 'SEEKER';
  onSelect: (role: 'FINDER' | 'SEEKER') => void;
}

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'SEEKER' as const,
      title: 'Talent Seeker',
      description: 'Discover internships, projects, and opportunities.',
      icon: Search,
      accent: 'blue'
    },
    {
      id: 'FINDER' as const,
      title: 'Talent Finder',
      description: 'Post roles and connect with students to collaborate.',
      icon: Briefcase,
      accent: 'violet'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        const Icon = role.icon;
        const selectedStateClasses =
          role.accent === 'blue'
            ? 'border-blue-500/80 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]'
            : 'border-violet-500/80 bg-violet-500/10 shadow-[0_0_0_1px_rgba(139,92,246,0.25)]';
        const iconClasses =
          role.accent === 'blue'
            ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/40'
            : 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/40';
        const badgeClasses =
          role.accent === 'blue'
            ? 'text-blue-300 bg-blue-500/15 border-blue-400/40'
            : 'text-violet-300 bg-violet-500/15 border-violet-400/40';

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            aria-pressed={isSelected}
            className={[
              'group relative rounded-2xl border px-4 py-3.5 text-left transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
              'hover:border-slate-400/40 hover:bg-slate-900/70',
              isSelected
                ? selectedStateClasses
                : 'border-white/10 bg-slate-950/45'
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <div className={['shrink-0 rounded-xl p-2.5', iconClasses].join(' ')}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold leading-tight text-white">{role.title}</p>
                <p className="mt-1 text-sm leading-5 text-slate-400">{role.description}</p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {isSelected ? 'Active role' : 'Click to select'}
              </span>
              {isSelected && (
                <span
                  className={[
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                    badgeClasses
                  ].join(' ')}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Selected
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

