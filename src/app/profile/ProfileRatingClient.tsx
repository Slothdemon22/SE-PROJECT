'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, TrendingUp, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

interface RatingData {
  rating: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  feedback: string;
  profileCompleteness: number;
}

interface ProfileRatingClientProps {
  userId: string;
}

export default function ProfileRatingClient({ userId }: ProfileRatingClientProps) {
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

  const getRatingColor = (rating: number): string => {
    if (rating >= 8) return '#10b981'; // emerald
    if (rating >= 6) return '#3b82f6'; // blue
    if (rating >= 4) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getRatingLabel = (rating: number): string => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 7) return 'Great';
    if (rating >= 5) return 'Good';
    if (rating >= 3) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      {/* Rate Profile Button */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-indigo-500/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.1)] relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
              <span className="text-4xl drop-shadow-lg">🤖</span>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                AI Profile Rating
              </h3>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 mt-2 md:mt-0">
                AI-Powered
              </Badge>
            </div>
            <p className="text-slate-300 text-lg max-w-2xl">
              Get personalized AI-powered insights, recommendations, and a professional score (0-10) for your profile
            </p>
          </div>
          <Button
            onClick={handleRateProfile}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 whitespace-nowrap text-lg transition-all hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Rate My Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-rose-400 text-lg">Error</h4>
              <p className="text-rose-300 mt-1">{error}</p>
              {error.includes('API key') && (
                <p className="text-sm text-rose-400/80 mt-2">
                  Please ensure API_KEY is configured in your environment variables for Groq.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Results */}
      {ratingData && (
        <div className="space-y-6">
          {/* Overall Rating Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-black/20"
                    style={{
                      background: `linear-gradient(135deg, ${getRatingColor(ratingData.rating)}, ${getRatingColor(ratingData.rating)}99)`
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl font-black">{ratingData.rating}</div>
                      <div className="text-xs font-medium uppercase tracking-wider opacity-80 mt-1">out of 10</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-white mb-2">
                      {getRatingLabel(ratingData.rating)}
                    </h3>
                    <p className="text-slate-300 text-lg">
                      {ratingData.summary}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 text-center min-w-[200px]">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Completeness
                </div>
                <div className="text-4xl font-black text-blue-400">
                  {ratingData.profileCompleteness}%
                </div>
              </div>
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
              <h4 className="text-xl font-bold flex items-center gap-2 mb-6 text-emerald-400 relative z-10">
                <TrendingUp className="w-6 h-6" />
                Strengths
              </h4>
              <ul className="space-y-4 relative z-10">
                {ratingData.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="text-slate-300 font-medium leading-relaxed">
                      {strength}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-orange-500/20 p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full"></div>
              <h4 className="text-xl font-bold flex items-center gap-2 mb-6 text-orange-400 relative z-10">
                <TrendingDown className="w-6 h-6" />
                Areas for Improvement
              </h4>
              <ul className="space-y-4 relative z-10">
                {ratingData.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </div>
                    <span className="text-slate-300 font-medium leading-relaxed">
                      {improvement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
            <h4 className="text-xl font-bold mb-4 text-white">
              Detailed Feedback
            </h4>
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {ratingData.feedback}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              onClick={handleRateProfile}
              variant="outline"
              disabled={loading}
              className="bg-slate-900 border-white/10 text-white hover:bg-slate-800 px-8 py-6 rounded-xl text-lg font-bold"
            >
              Rate Again
            </Button>
            <Button
              onClick={() => window.location.href = '/profile/edit'}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20"
            >
              Improve Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
