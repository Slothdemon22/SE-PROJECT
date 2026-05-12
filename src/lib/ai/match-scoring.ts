import Groq from 'groq-sdk';

interface MatchScoreRequest {
  jobTitle: string;
  jobDescription: string;
  jobRequirements: string | null;
  jobTags: string[];
  applicantSkills: string[];
  applicantInterests: string[];
  applicantBio: string | null;
  applicantProposal: string | null;
  applicantDepartment: string | null;
  applicantYear: string | null;
}

interface MatchScoreResponse {
  score: number; // 0-100
  reasoning: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

/**
 * Calculate match score between job and applicant using AI
 */
export async function calculateMatchScore(
  request: MatchScoreRequest
): Promise<MatchScoreResponse> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured for Groq');
    }

    const groq = new Groq({ apiKey });
    const prompt = buildMatchPrompt(request);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    
    const text = chatCompletion.choices[0].message.content || '{}';

    // Parse AI response
    let aiResponse: MatchScoreResponse;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      // Fallback to basic calculation
      return calculateBasicMatchScore(request);
    }

    // Validate and normalize score
    if (typeof aiResponse.score !== 'number' || aiResponse.score < 0 || aiResponse.score > 100) {
      aiResponse.score = Math.max(0, Math.min(100, Math.round(aiResponse.score)));
    }

    return {
      score: Math.round(aiResponse.score),
      reasoning: aiResponse.reasoning || 'AI analysis completed',
      strengths: aiResponse.strengths || [],
      gaps: aiResponse.gaps || [],
      recommendation: aiResponse.recommendation || '',
    };

  } catch (error) {
    console.error('Error calculating AI match score:', error);
    // Fallback to basic calculation
    return calculateBasicMatchScore(request);
  }
}

/**
 * Build prompt for AI match scoring
 */
function buildMatchPrompt(request: MatchScoreRequest): string {
  return `
You are an elite talent acquisition specialist at a top-tier tech firm. Your task is to perform a high-fidelity analysis of the match between a candidate and a specific job opportunity.

CRITICAL EVALUATION CRITERIA:
1. **Technical Proficiency**: Deep dive into the alignment between ${request.jobTags.join(', ')} and the candidate's actual skill set.
2. **Academic & Professional Trajectory**: Analyze the ${request.applicantDepartment} background and ${request.applicantYear} status for role appropriateness.
3. **Intent & Motivation**: Evaluate the nuance in the applicant's proposal and bio. Look for genuine passion and specific value propositions.
4. **Cultural & Visionary Fit**: Does this candidate show signs of being a high-impact contributor?
5. **Gaps & Risks**: Be honest about missing critical skills or experience.

SCORING PHILOSOPHY:
- **90-100**: Exceptional elite talent. Almost zero gaps.
- **75-89**: High-potential candidate. Strong alignment with minor learning curves.
- **60-74**: Competent match. Requires some oversight or training in specific areas.
- **40-59**: Significant gaps. Potential "stretch" candidate.
- **0-39**: Misalignment. Critical requirements not met.

Return your expert analysis in this EXACT JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<Nuanced 2-3 sentence executive summary of the match>",
  "strengths": ["<Unique value prop 1>", "<Unique value prop 2>", "<Unique value prop 3>"],
  "gaps": ["<Critical gap 1>", "<Critical gap 2>", "<Critical gap 3>"],
  "recommendation": "<Strategic hiring recommendation for the manager>"
}
`;
}

/**
 * Fallback: Basic match score calculation without AI
 */
function calculateBasicMatchScore(request: MatchScoreRequest): MatchScoreResponse {
  let score = 0;
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Skills matching (40 points max)
  const matchingSkills = request.applicantSkills.filter(skill =>
    request.jobTags.some(tag => 
      tag.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(tag.toLowerCase())
    )
  );
  
  if (request.jobTags.length > 0) {
    const skillScore = (matchingSkills.length / request.jobTags.length) * 40;
    score += skillScore;
    
    if (matchingSkills.length > 0) {
      strengths.push(`Matches ${matchingSkills.length} required skills`);
    } else {
      gaps.push('No direct skill matches with job requirements');
    }
  }

  // Interests matching (20 points max)
  const matchingInterests = request.applicantInterests.filter(interest =>
    request.jobTags.some(tag => 
      tag.toLowerCase().includes(interest.toLowerCase()) || 
      interest.toLowerCase().includes(tag.toLowerCase())
    )
  );
  
  if (matchingInterests.length > 0) {
    score += Math.min(20, matchingInterests.length * 7);
    strengths.push('Interests align with job domain');
  }

  // Profile completeness (20 points max)
  let completeness = 0;
  if (request.applicantBio) completeness += 5;
  if (request.applicantSkills.length > 0) completeness += 7;
  if (request.applicantProposal) completeness += 8;
  score += completeness;

  if (completeness > 15) {
    strengths.push('Strong application with detailed information');
  } else {
    gaps.push('Limited profile information provided');
  }

  // Department relevance (10 points max)
  if (request.applicantDepartment) {
    const deptRelevant = request.jobDescription.toLowerCase().includes(request.applicantDepartment.toLowerCase());
    if (deptRelevant) {
      score += 10;
      strengths.push('Relevant academic background');
    }
  }

  // Proposal quality (10 points max)
  if (request.applicantProposal && request.applicantProposal.length > 100) {
    score += 10;
    strengths.push('Thoughtful application proposal');
  } else if (!request.applicantProposal) {
    gaps.push('No application proposal provided');
  }

  // Ensure we have at least some gaps if score is low
  if (score < 60 && gaps.length === 0) {
    gaps.push('Profile could be more complete');
    gaps.push('Limited skill matches');
  }

  // Ensure we have strengths if score is decent
  if (score >= 60 && strengths.length === 0) {
    strengths.push('Reasonable fit for the position');
  }

  score = Math.round(Math.min(100, Math.max(0, score)));

  let recommendation = '';
  if (score >= 75) {
    recommendation = 'Strong candidate - Recommend for interview';
  } else if (score >= 60) {
    recommendation = 'Good candidate - Worth considering';
  } else if (score >= 40) {
    recommendation = 'Moderate fit - Review carefully';
  } else {
    recommendation = 'May not be the best fit for this role';
  }

  return {
    score,
    reasoning: `Calculated based on skill alignment (${matchingSkills.length}/${request.jobTags.length} matches), profile completeness, and relevant experience.`,
    strengths: strengths.slice(0, 3),
    gaps: gaps.slice(0, 3),
    recommendation,
  };
}

/**
 * Calculate simple percentage match (for quick display)
 */
export function calculateSimpleMatch(
  jobTags: string[],
  applicantSkills: string[],
  applicantInterests: string[]
): number {
  if (jobTags.length === 0) return 0;

  const allUserTags = [...applicantSkills, ...applicantInterests];
  const matchingTags = jobTags.filter(tag =>
    allUserTags.some(userTag =>
      tag.toLowerCase().includes(userTag.toLowerCase()) ||
      userTag.toLowerCase().includes(tag.toLowerCase())
    )
  );

  return Math.floor((matchingTags.length / jobTags.length) * 100);
}

