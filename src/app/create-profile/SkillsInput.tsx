'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SUGGESTED_SKILLS = [
  'JavaScript',
  'TypeScript',
  'Python',
  'React',
  'Node.js',
  'UI/UX Design',
  'Figma',
  'Machine Learning',
  'Data Analysis',
  'Project Management',
  'Marketing',
  'Content Writing',
  'Video Editing',
  'Public Speaking',
  'Leadership',
  'Flutter',
  'iOS Development',
  'Android Development',
  'SQL',
  'AWS',
];

export function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [inlineError, setInlineError] = useState('');

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    
    if (!trimmedSkill) return;
    
    if (trimmedSkill.length > 50) {
      setInlineError('Skill is too long (max 50 characters).');
      return;
    }
    
    if (skills.length >= 20) {
      setInlineError('Maximum 20 skills allowed.');
      return;
    }
    
    if (skills.includes(trimmedSkill)) {
      setInlineError('This skill already exists.');
      return;
    }
    
    onChange([...skills, trimmedSkill]);
    setInputValue('');
    setInlineError('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill (e.g., React, Python, Design...)"
          className="bg-slate-950/60 border-white/10 text-white"
          maxLength={50}
        />
        <Button
          type="button"
          onClick={() => addSkill(inputValue)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {inlineError && (
        <p className="text-xs text-amber-300">{inlineError}</p>
      )}

      {/* Selected Skills */}
      {skills.length > 0 && (
        <div className="surface-card-muted flex flex-wrap gap-2 p-4">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 border border-blue-500/20 bg-blue-500/10 text-blue-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-rose-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggested Skills */}
      <div>
        <p className="text-sm font-medium mb-2 text-slate-200">
          Suggested Skills (click to add):
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="px-3 py-1.5 text-sm rounded-full transition-colors border border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/5"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Added {skills.length}/20 skill{skills.length !== 1 ? 's' : ''} • These help match you with relevant opportunities
      </p>
    </div>
  );
}

