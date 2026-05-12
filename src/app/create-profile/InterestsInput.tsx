'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface InterestsInputProps {
  interests: string[];
  onChange: (interests: string[]) => void;
}

const SUGGESTED_INTERESTS = [
  'Web Development',
  'Mobile Apps',
  'AI & Machine Learning',
  'Blockchain',
  'Cybersecurity',
  'Game Development',
  'Startups',
  'Hackathons',
  'Research',
  'Open Source',
  'Entrepreneurship',
  'Data Science',
  'Cloud Computing',
  'IoT',
  'Robotics',
  'AR/VR',
  'Sustainability',
  'Social Impact',
  'EdTech',
  'FinTech',
];

export function InterestsInput({ interests, onChange }: InterestsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [inlineError, setInlineError] = useState('');

  const addInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    
    if (!trimmedInterest) return;
    
    if (trimmedInterest.length > 50) {
      setInlineError('Interest is too long (max 50 characters).');
      return;
    }
    
    if (interests.length >= 20) {
      setInlineError('Maximum 20 interests allowed.');
      return;
    }
    
    if (interests.includes(trimmedInterest)) {
      setInlineError('This interest already exists.');
      return;
    }
    
    onChange([...interests, trimmedInterest]);
    setInputValue('');
    setInlineError('');
  };

  const removeInterest = (interestToRemove: string) => {
    onChange(interests.filter((i) => i !== interestToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest(inputValue);
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
          placeholder="Add an interest (e.g., Startups, AI, Game Dev...)"
          className="bg-slate-950/60 border-white/10 text-white"
          maxLength={50}
        />
        <button
          type="button"
          onClick={() => addInterest(inputValue)}
          className="px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {inlineError && (
        <p className="text-xs text-amber-300">{inlineError}</p>
      )}

      {/* Selected Interests */}
      {interests.length > 0 && (
        <div className="surface-card-muted flex flex-wrap gap-2 p-4">
          {interests.map((interest) => (
            <Badge
              key={interest}
              variant="secondary"
              className="px-3 py-1.5 text-sm flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(interest)}
                className="hover:text-rose-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Suggested Interests */}
      <div>
        <p className="text-sm font-medium mb-2 text-slate-200">
          Popular Interests (click to add):
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_INTERESTS.filter((i) => !interests.includes(i)).map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => addInterest(interest)}
              className="px-3 py-1.5 text-sm rounded-full transition-colors border border-white/10 bg-slate-950/60 text-slate-200 hover:bg-white/5"
            >
              + {interest}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Added {interests.length}/20 interest{interests.length !== 1 ? 's' : ''} • These help us recommend relevant opportunities
      </p>
    </div>
  );
}

