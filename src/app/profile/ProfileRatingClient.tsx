'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

interface RatingData {
  rating: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
  profileCompleteness: number;
}

export default function ProfileRatingClient() {
  const [loading, setLoading] = useState<boolean>(false);
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [error, setError] = useState<string>('');

  const handleRateProfile = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setRatingData(null);

    try {
      const response = await fetch('/api/profile/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rate profile');
      }

      if (data.success && data.data) {
        setRatingData(data.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error rating profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while rating your profile');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (rating: number): string => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 7) return 'Strong';
    if (rating >= 5) return 'Good';
    if (rating >= 3) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="space-y-4">
      <div className="surface-card-muted p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              AI Profile Assessment
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Get a concise score and targeted improvements for your profile quality.
            </p>
          </div>
          <Button
            onClick={handleRateProfile}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run Assessment
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="surface-card-muted p-4 border-rose-500/30">
          <div className="flex items-start gap-2 text-rose-300">
            <XCircle className="w-4 h-4 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {ratingData && (
        <div className="grid gap-4">
          <div className="surface-card-muted p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Overall Rating</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {ratingData.rating}/10
                  <span className="text-base font-medium text-slate-400 ml-2">{getRatingLabel(ratingData.rating)}</span>
                </p>
                <p className="text-sm text-slate-300 mt-2">{ratingData.summary}</p>
              </div>
              <div className="surface-kpi min-w-[140px] text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">Completeness</p>
                <p className="text-2xl font-bold text-blue-300 mt-1">{ratingData.profileCompleteness}%</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="surface-card-muted p-5">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {ratingData.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card-muted p-5">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                Priority Improvements
              </h4>
              <ul className="space-y-2">
                {ratingData.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
