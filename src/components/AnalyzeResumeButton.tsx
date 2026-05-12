'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ui/toast';

interface AnalyzeResumeButtonProps {
  resumeId: string;
  fileName: string;
  fileUrl: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

interface ResumeAnalysis {
  summary: string;
  detectedSkills: string[];
  experienceLevel: string;
  yearsOfExperience: number;
  strengths: string[];
  improvements: string[];
  suggestedJobTitles: string[];
  overallScore: number;
  wordCount?: number;
  pageCount?: number;
  insights: {
    education: string;
    professionalSummary: string;
    keyAchievements: string[];
  };
}

export default function AnalyzeResumeButton({
  resumeId,
  fileName,
  fileUrl,
  variant = 'outline',
  size = 'sm',
}: AnalyzeResumeButtonProps): JSX.Element {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const analyzeResume = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      // Download the file
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error('Failed to download resume file');
      }

      const blob = await fileResponse.blob();
      
      // Determine correct MIME type (blob.type can be empty from storage URLs)
      let mimeType = blob.type || '';
      if (fileName.toLowerCase().endsWith('.pdf')) {
        mimeType = 'application/pdf';
      } else if (fileName.toLowerCase().endsWith('.docx')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (fileName.toLowerCase().endsWith('.txt')) {
        mimeType = 'text/plain';
      }

      const file = new File([blob], fileName, { type: mimeType });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resumeId', resumeId);

      // Call analysis API
      const response = await fetch('/api/resumes/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const data = await response.json();
      
      // Check if the response has error
      if (data.error) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      // Validate response has required fields
      if (data.success && data.overallScore !== undefined) {
        const analysisData: ResumeAnalysis = {
          summary: data.professionalSummary || '',
          detectedSkills: data.detectedSkills || [],
          experienceLevel: data.experienceLevel || 'N/A',
          yearsOfExperience: data.yearsOfExperience || 0,
          strengths: data.strengths || [],
          improvements: data.improvements || [],
          suggestedJobTitles: data.suggestedJobTitles || [],
          overallScore: data.overallScore || 0,
          wordCount: data.wordCount,
          pageCount: data.pageCount,
          insights: {
            education: data.education || '',
            professionalSummary: data.professionalBackground || data.professionalSummary || '',
            keyAchievements: data.keyAchievements || [],
          },
        };

        // Store analysis in sessionStorage and redirect to results page
        try {
          sessionStorage.setItem('resumeAnalysis', JSON.stringify(analysisData));
          // Small delay to ensure sessionStorage is set before navigation
          await new Promise(resolve => setTimeout(resolve, 50));
          router.push(`/ai-results/resume-analysis?resumeId=${encodeURIComponent(resumeId)}&fileName=${encodeURIComponent(fileName)}`);
        } catch (storageError) {
          console.error('Failed to store analysis in sessionStorage:', storageError);
          // Still redirect, but show error on page
          router.push(`/ai-results/resume-analysis?resumeId=${encodeURIComponent(resumeId)}&fileName=${encodeURIComponent(fileName)}&error=storage_failed`);
        }
      } else {
        console.error('Invalid API response:', data);
        throw new Error('Invalid response format from server - missing required fields');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
      setError(errorMessage);
      toast.error(`${errorMessage} Please make sure your resume is in PDF, DOCX, or TXT format.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={analyzeResume}
      disabled={loading}
      variant={variant}
      size={size}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          AI Analysis
        </>
      )}
    </Button>
  );
}

