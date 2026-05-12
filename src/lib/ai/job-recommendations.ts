import Groq from 'groq-sdk';

interface UserProfile {
  fullName: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  department: string | null;
  year: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  tags: string[];
  type: string;
  location: string | null;
}

export interface JobRecommendation {
  jobId: string;
  score: number;
  reasoning: string;
  matchHighlights: string[];
  growthPotential: string;
}

export interface RecommendationResponse {
  recommendations: JobRecommendation[];
  careerInsights: string;
  topSkillsToLearn: string[];
}

/**
 * Get AI-powered job recommendations for a user
 */
export async function getJobRecommendations(
  profile: UserProfile,
  jobs: Job[]
): Promise<RecommendationResponse> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured for Groq');
    }

    const groq = new Groq({ apiKey });

    const prompt = `
# Persona: Executive Career Strategist & Portfolio Manager (Elite Tier)

You are a top-tier career architect responsible for placing elite talent in high-impact roles. Your analysis must be surgical, strategic, and focused on both immediate fit and long-term trajectory.

### USER PROFILE (THE TALENT):
- Name: ${profile.fullName || 'N/A'}
- Narrative: ${profile.bio || 'N/A'}
- Expert Skills: ${profile.skills.join(', ') || 'None'}
- Strategic Interests: ${profile.interests.join(', ') || 'None'}
- Academic Focus: ${profile.department || 'N/A'}
- Career Stage: ${profile.year || 'N/A'}

### AVAILABLE ECOSYSTEM OPPORTUNITIES:
${jobs.map((job, idx) => `
[ID: ${job.id}] ${job.title.toUpperCase()}
- Format: ${job.type} | Location: ${job.location || 'Distributed'}
- Context: ${job.description.substring(0, 400)}...
- Requirements: ${job.requirements || 'Standard'}
- Tags: ${Array.isArray(job.tags) ? job.tags.join(', ') : 'None'}
`).join('\n')}

### STRATEGIC OBJECTIVES:
1. **Surgical Alignment**: Analyze all jobs and identify the top 5 maximum.
2. **Impact Scoring**: Rate matches from 0-100. Be conservative. 90+ is a perfect alignment.
3. **Strategic Reasoning**: Explain EXACTLY why this role matches the talent's narrative and goals.
4. **Growth Vector**: Identify the specific professional evolution this role offers.
5. **Career Architecture**: Provide high-level career insights and identifying critical skill gaps.

Return response in EXACT JSON format:
{
  "recommendations": [
    {
      "jobId": "job_id",
      "score": <number 0-100>,
      "reasoning": "<strategic alignment narrative>",
      "matchHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
      "growthPotential": "<evolution narrative>"
    }
  ],
  "careerInsights": "<high-level career strategy>",
  "topSkillsToLearn": ["Skill 1", "Skill 2", "Skill 3"]
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const text = chatCompletion.choices[0].message.content || '{}';

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const data = JSON.parse(jsonMatch[0]) as RecommendationResponse;

    // Validate response
    if (!data.recommendations || !Array.isArray(data.recommendations)) {
      throw new Error('Invalid recommendations format');
    }

    // Ensure recommendations exist in jobs list
    const validRecommendations = data.recommendations.filter(rec =>
      jobs.some(job => job.id === rec.jobId)
    );

    return {
      recommendations: validRecommendations.slice(0, 5),
      careerInsights: data.careerInsights || 'Continue building your skills and applying to relevant opportunities.',
      topSkillsToLearn: data.topSkillsToLearn || [],
    };
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    // Fallback: Simple matching algorithm
    return getFallbackRecommendations(profile, jobs);
  }
}

/**
 * Fallback recommendation system
 */
function getFallbackRecommendations(
  profile: UserProfile,
  jobs: Job[]
): RecommendationResponse {
  const userTags = [...profile.skills, ...profile.interests]
    .map((tag) => tag.trim())
    .filter(Boolean);
  
  const scoredJobs = jobs.map(job => {
    let score = 0;
    const highlights = new Set<string>();
    const combinedText = `${job.title} ${job.description} ${job.requirements || ''}`.toLowerCase();

    // Match skills and interests
    const matchingTags = job.tags.filter(tag =>
      userTags.some(userTag =>
        tag.toLowerCase().includes(userTag.toLowerCase()) ||
        userTag.toLowerCase().includes(tag.toLowerCase())
      )
    );

    if (matchingTags.length > 0) {
      score += (matchingTags.length / Math.max(job.tags.length, 1)) * 55;
      highlights.add(`${matchingTags.length} matching skill${matchingTags.length > 1 ? 's' : ''}`);
    }

    // Match keywords in title/description/requirements
    const bioLower = (profile.bio || '').toLowerCase();
    userTags.forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      if (combinedText.includes(normalizedTag)) {
        score += 4;
      }
      if (bioLower && normalizedTag.length > 3 && combinedText.includes(normalizedTag)) {
        highlights.add(`Relevant experience in ${tag}`);
      }
    });

    // Career-stage fit
    if (profile.year) {
      const isSeniorStage = /(senior|lead|principal|manager)/i.test(combinedText);
      const isEarlyStage = /(intern|junior|entry|graduate)/i.test(combinedText);
      if (isEarlyStage) score += 8;
      if (isSeniorStage) score -= 5;
    }

    // Reward explicit requirement detail
    if (job.requirements && job.requirements.trim().length > 30) {
      score += 5;
      highlights.add('Clear role requirements');
    }

    // Department/Year bonus
    if (profile.department && job.tags.some(tag => 
      tag.toLowerCase().includes(profile.department!.toLowerCase())
    )) {
      score += 10;
      highlights.add('Department match');
    }

    return {
      jobId: job.id,
      score: Math.min(Math.round(score), 100),
      reasoning: `This position matches your profile with ${matchingTags.length} overlapping skills and relevant requirements.`,
      matchHighlights: Array.from(highlights).slice(0, 3).length > 0 ? Array.from(highlights).slice(0, 3) : ['General fit based on profile'],
      growthPotential: 'Opportunity to expand your skills and gain valuable experience.',
    };
  });

  // Sort by score and take top 5
  const recommendations = scoredJobs
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    recommendations,
    careerInsights: 'Focus on roles that match your current skills while offering growth opportunities.',
    topSkillsToLearn: ['Communication', 'Problem Solving', 'Leadership'],
  };
}

