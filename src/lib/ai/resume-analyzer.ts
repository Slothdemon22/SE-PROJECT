import Groq from 'groq-sdk';

export interface ResumeAnalysis {
  summary: string;
  detectedSkills: string[];
  experienceLevel: 'Entry Level' | 'Junior' | 'Mid Level' | 'Senior' | 'Expert';
  yearsOfExperience: number;
  strengths: string[];
  improvements: string[];
  suggestedJobTitles: string[];
  overallScore: number; // 0-100
  insights: {
    education: string;
    professionalSummary: string;
    keyAchievements: string[];
  };
}

/**
 * Analyze resume text using AI
 */
export async function analyzeResumeWithAI(
  resumeText: string,
  fileName: string
): Promise<ResumeAnalysis> {
  try {
    if (!process.env.API_KEY) {
      throw new Error('API_KEY not configured for Groq');
    }

    if (!resumeText || resumeText.trim().length < 100) {
      throw new Error('Resume text is too short or empty');
    }

    const groq = new Groq({ apiKey: process.env.API_KEY });
    const prompt = buildResumeAnalysisPrompt(resumeText, fileName);

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const text = chatCompletion.choices[0].message.content || '{}';

    // Parse AI response
    let aiResponse: ResumeAnalysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      // Fallback to basic analysis
      return analyzeResumeBasic(resumeText);
    }

    // Validate and normalize the response
    return {
      summary: (aiResponse.summary || 'No summary available').trim(),
      detectedSkills: sanitizeStringList(aiResponse.detectedSkills, 20),
      experienceLevel: validateExperienceLevel(aiResponse.experienceLevel),
      yearsOfExperience: typeof aiResponse.yearsOfExperience === 'number' ? aiResponse.yearsOfExperience : 0,
      strengths: sanitizeStringList(aiResponse.strengths, 5),
      improvements: sanitizeStringList(aiResponse.improvements, 5),
      suggestedJobTitles: sanitizeStringList(aiResponse.suggestedJobTitles, 5),
      overallScore: Math.max(0, Math.min(100, aiResponse.overallScore || 50)),
      insights: {
        education: (aiResponse.insights?.education || 'Not specified').trim(),
        professionalSummary: (aiResponse.insights?.professionalSummary || 'Not available').trim(),
        keyAchievements: sanitizeStringList(aiResponse.insights?.keyAchievements, 3),
      },
    };
  } catch (error) {
    console.error('Error analyzing resume with AI:', error);
    // Fallback to basic analysis
    return analyzeResumeBasic(resumeText);
  }
}

/**
 * Build prompt for AI resume analysis
 */
function buildResumeAnalysisPrompt(resumeText: string, fileName: string): string {
  return `You are a senior executive recruiter and career strategist with decades of experience at top-tier firms like McKinsey, Google, and Goldman Sachs. Your mission is to perform a surgical analysis of the provided resume, identifying hidden potential and critical deficiencies.

RESUME FILE: ${fileName}
RESUME CONTENT:
${resumeText.substring(0, 8000)}

ANALYSIS PROTOCOL:
1. **Semantic Skill Extraction**: Identify not just keywords, but deep technical proficiencies and nuanced soft skills (e.g., "Architectural Design" over just "Java").
2. **Experience Calibration**: Accurately assess seniority level (Entry Level, Junior, Mid Level, Senior, Expert) and calculate precisely the years of professional experience.
3. **Strategic Value Props**: Identify the candidate's "superpowers"—strengths that make them stand out in an elite pool.
4. **Actionable Optimization**: Provide rigorous, specific improvements that would elevate the resume to a "must-hire" status.
   - Each improvement must begin with an action verb and include a concrete example.
   - Focus on the highest-impact fixes first.
5. **Career Pathing**: Recommend highly targeted job titles that align with the candidate's trajectory.
6. **Executive Scoring**: Rate the resume quality (0-100) based on content, impact, and clarity.

Return your expert analysis in this EXACT JSON format:
{
  "summary": "<Nuanced 2-3 sentence professional persona summary>",
  "detectedSkills": ["Strategic skill 1", "Strategic skill 2", ...],
  "experienceLevel": "<Entry Level|Junior|Mid Level|Senior|Expert>",
  "yearsOfExperience": <number>,
  "strengths": ["<Elite strength 1>", "<Elite strength 2>", "<Elite strength 3>", "<Elite strength 4>", "<Elite strength 5>"],
  "improvements": ["<Surgical improvement 1>", "<Surgical improvement 2>", "<Surgical improvement 3>"],
  "suggestedJobTitles": ["<Targeted role 1>", "<Targeted role 2>", "<Targeted role 3>"],
  "overallScore": <number 0-100>,
  "insights": {
    "education": "<Executive summary of academic background>",
    "professionalSummary": "<Deep-dive strategic background analysis>",
    "keyAchievements": ["<High-impact achievement 1>", "<High-impact achievement 2>", "<High-impact achievement 3>"]
  }
}

function sanitizeStringList(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  const unique = new Set<string>()
  for (const entry of value) {
    if (typeof entry !== 'string') continue
    const cleaned = entry.trim()
    if (!cleaned) continue
    if (!unique.has(cleaned)) {
      unique.add(cleaned)
    }
    if (unique.size >= limit) break
  }

  return Array.from(unique)
}
`;
}

/**
 * Validate experience level
 */
function validateExperienceLevel(level: string): ResumeAnalysis['experienceLevel'] {
  const validLevels: ResumeAnalysis['experienceLevel'][] = [
    'Entry Level',
    'Junior',
    'Mid Level',
    'Senior',
    'Expert',
  ];
  
  if (validLevels.includes(level as any)) {
    return level as ResumeAnalysis['experienceLevel'];
  }
  
  return 'Mid Level';
}

/**
 * Fallback: Basic resume analysis without AI
 */
function analyzeResumeBasic(resumeText: string): ResumeAnalysis {
  const text = resumeText.toLowerCase();
  
  // Extract skills using common keywords
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'angular', 'vue',
    'node.js', 'express', 'django', 'flask', 'spring', 'sql', 'mongodb', 'postgresql',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'leadership',
    'communication', 'problem solving', 'teamwork', 'html', 'css', 'rest api',
  ];
  
  const detectedSkills = commonSkills.filter(skill =>
    text.includes(skill.toLowerCase())
  );

  // Estimate experience
  const experienceKeywords = ['years of experience', 'years experience', 'year experience'];
  let yearsOfExperience = 0;
  
  experienceKeywords.forEach(keyword => {
    const regex = new RegExp(`(\\d+)\\+?\\s*${keyword}`, 'i');
    const match = resumeText.match(regex);
    if (match && match[1]) {
      yearsOfExperience = Math.max(yearsOfExperience, parseInt(match[1]));
    }
  });

  // Determine level
  let experienceLevel: ResumeAnalysis['experienceLevel'] = 'Entry Level';
  if (yearsOfExperience >= 7) experienceLevel = 'Senior';
  else if (yearsOfExperience >= 4) experienceLevel = 'Mid Level';
  else if (yearsOfExperience >= 2) experienceLevel = 'Junior';

  // Basic scoring
  let score = 50;
  if (detectedSkills.length > 10) score += 20;
  else if (detectedSkills.length > 5) score += 10;
  
  if (text.includes('bachelor') || text.includes('degree')) score += 10;
  if (text.includes('master') || text.includes('phd')) score += 10;
  if (text.includes('project') || text.includes('developed')) score += 10;

  return {
    summary: `Professional with ${yearsOfExperience} years of experience and skills in ${detectedSkills.slice(0, 3).join(', ')}.`,
    detectedSkills: detectedSkills.slice(0, 15),
    experienceLevel,
    yearsOfExperience,
    strengths: [
      `${detectedSkills.length} technical skills identified`,
      'Well-structured resume format',
      'Clear professional experience',
    ],
    improvements: [
      'Add more quantifiable achievements',
      'Include specific project outcomes',
      'Expand on technical skills',
    ],
    suggestedJobTitles: ['Software Developer', 'Full Stack Engineer', 'Technical Consultant'],
    overallScore: Math.min(100, score),
    insights: {
      education: 'Education details detected',
      professionalSummary: `${yearsOfExperience} years of professional experience`,
      keyAchievements: ['Multiple technical projects', 'Diverse skill set'],
    },
  };
}

