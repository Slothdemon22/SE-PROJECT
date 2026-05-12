import Groq from 'groq-sdk';

interface JobRefineRequest {
  role: string;
  currentDescription?: string;
  currentRequirements?: string;
  duration?: string;
  compensation?: string;
  type?: string;
}

export interface JobRefineResponse {
  title: string;
  description: string;
  requirements: string;
  suggestedTags: string[];
  duration: string;
  teamSize: string;
  compensation: string;
}

/**
 * Refine job description and requirements using AI
 */
export async function refineJobWithAI(request: JobRefineRequest): Promise<JobRefineResponse> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured for Groq');
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are a world-class Employer Branding specialist and Senior Technical Recruiter. Your objective is to transform a basic job requirement into a high-conversion, professional, and elite-level job posting that attracts top-tier student talent.

ROLE: ${request.role}
${request.currentDescription ? `CURRENT DESCRIPTION: ${request.currentDescription}` : ''}
${request.currentRequirements ? `CURRENT REQUIREMENTS: ${request.currentRequirements}` : ''}
${request.type ? `JOB TYPE: ${request.type}` : ''}
${request.duration ? `DURATION: ${request.duration}` : ''}
${request.compensation ? `COMPENSATION: ${request.compensation}` : ''}

TRANSFORMATION PROTOCOL:
1. **Executive Title**: Craft a polished, industry-standard job title that sounds prestigious.
2. **Value Prop Description**: Write a compelling narrative (3-4 paragraphs) that covers:
   - Mission: Why this project matters.
   - Impact: What the candidate will actually build and own.
   - Growth: What elite skills they will master.
   - Culture: The collaborative environment they will join.
3. **Surgical Requirements**: List 5-8 bullet points of high-impact requirements:
   - Technical mastery needed.
   - Behavioral and soft skill expectations.
   - Outcome-oriented qualifications.
4. **Strategic Metadata**: Provide 5-8 relevant, high-searchability tags, suggested duration, team size, and a realistic compensation range if not provided.

Return response in this EXACT JSON format:
{
  "title": "Elite Job Title",
  "description": "Sophisticated professional narrative...",
  "requirements": "• Outcome-based requirement 1\\n• Outcome-based requirement 2...",
  "suggestedTags": ["ModernTag1", "ModernTag2", ...],
  "duration": "Optimized duration",
  "teamSize": "Ideal collaboration size",
  "compensation": "Market-standard compensation"
}

IMPORTANT:
- Use sophisticated, evocative language.
- Focus on outcomes and ownership.
- Ensure requirements are rigorous but appropriate for student talent.
- Return ONLY valid JSON.`;

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

    const data = JSON.parse(jsonMatch[0]) as JobRefineResponse;

    return {
      title: data.title || request.role,
      description: data.description || 'No description provided',
      requirements: data.requirements || '',
      suggestedTags: data.suggestedTags || [],
      duration: data.duration || request.duration || 'Flexible',
      teamSize: data.teamSize || 'To be determined',
      compensation: data.compensation || request.compensation || 'To be discussed',
    };
  } catch (error) {
    console.error('Error refining job with AI:', error);
    
    // Fallback response
    return {
      title: request.role,
      description: request.currentDescription || `We are looking for a talented ${request.role} to join our team.`,
      requirements: request.currentRequirements || `• Relevant experience in ${request.role}\n• Strong communication skills\n• Ability to work independently`,
      suggestedTags: [request.role.split(' ')[0], 'Student', 'Campus'],
      duration: request.duration || 'Flexible',
      teamSize: '2-4 people',
      compensation: request.compensation || 'To be discussed',
    };
  }
}

/**
 * Generate complete job description from just a role name
 */
export async function generateJobFromRole(role: string, type?: string): Promise<JobRefineResponse> {
  return refineJobWithAI({
    role,
    type,
  });
}

