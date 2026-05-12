'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Briefcase, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface JobRecommendation {
  id: string;
  title: string;
  description: string;
  jobType: string;
  location: string | null;
  matchScore: number;
  reasoning: string;
  matchHighlights: string[];
  growthPotential: string;
}

export default function AIJobRecommendations(): JSX.Element {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [careerInsights, setCareerInsights] = useState<string>('');
  const [topSkillsToLearn, setTopSkillsToLearn] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async (): Promise<void> => {
      try {
        const response = await fetch('/api/jobs/recommendations');
        if (response.ok) {
          const data = await response.json();
          setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
          setCareerInsights(data.careerInsights || '');
          setTopSkillsToLearn(Array.isArray(data.topSkillsToLearn) ? data.topSkillsToLearn : []);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="surface-card-muted p-5 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-slate-800" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-slate-900/60 border border-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="surface-card-muted p-5 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-blue-300" />
          <h3 className="text-lg font-semibold text-white">
            AI Recommendations
          </h3>
        </div>
        <div className="surface-kpi text-center py-8">
          <Briefcase className="w-10 h-10 mx-auto mb-3 text-slate-500" />
          <p className="text-sm text-slate-400">
            No recommendations available yet. Complete your profile to get personalized job matches!
          </p>
          <Link
            href="/profile/edit"
            className="focus-ring inline-flex items-center gap-2 mt-4 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Improve Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="section-header mb-0">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI-Powered Recommendations
            </h3>
            <p className="text-sm text-slate-400">
              Jobs matched to your profile signals and interests
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="group block surface-card-muted p-5 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1 text-white group-hover:text-blue-300 transition-colors">
                      {job.title}
                    </h4>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {job.matchScore}% Match
                  </div>
                </div>

                <p className="text-sm mb-3 line-clamp-2 text-slate-400">
                  {job.reasoning}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-blue-300">
                    {job.jobType}
                  </span>
                  {job.location && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                {job.matchHighlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.matchHighlights.slice(0, 2).map((highlight, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-white/10 bg-slate-950/60 text-slate-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-blue-300" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(careerInsights || topSkillsToLearn.length > 0) && (
        <div className="surface-card-muted p-4">
          {careerInsights && (
            <p className="text-sm mb-3 text-slate-300">
              {careerInsights}
            </p>
          )}
          {topSkillsToLearn.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {topSkillsToLearn.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300"
                >
                  Learn: {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        href="/jobs"
        className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-blue-200"
      >
        View all opportunities
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
