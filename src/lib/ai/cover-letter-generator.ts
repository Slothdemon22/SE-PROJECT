import Groq from 'groq-sdk';

interface CoverLetterRequest {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  requirements: string;
  applicantName: string;
  applicantBio: string;
  applicantSkills: string[];
  applicantExperience?: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
  tone: 'professional' | 'enthusiastic' | 'creative';
  wordCount: number;
  keyPoints: string[];
}

/**
 * Generate AI-powered cover letter
 */
export async function generateCoverLetter(
  request: CoverLetterRequest
): Promise<CoverLetterResponse> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured for Groq');
    }

    const groq = new Groq({ apiKey });

    const prompt = `
# Persona: Elite Persuasion Strategist & Executive Copywriter (Elite Tier)

You are a world-class copywriter specializing in high-stakes job applications. Your goal is to draft a cover letter that is not just professional, but irresistible. It must demonstrate psychological alignment with the company's mission and technical dominance.

### OPPORTUNITY CONTEXT:
- Role: ${request.jobTitle}
- Entity: ${request.companyName}
- Mission/Description: ${request.jobDescription}
- Requirements: ${request.requirements}

### TALENT PROFILE:
- Identity: ${request.applicantName}
- Narrative: ${request.applicantBio}
- Expert Skills: ${request.applicantSkills.join(', ')}
${request.applicantExperience ? `- Strategic Experience: ${request.applicantExperience}` : ''}

### STRATEGIC DIRECTIVES:
1. **The Hook**: Open with a narrative-driven introduction that connects your mission to the company's.
2. **Quantified Impact**: Reference skills and bio to show HOW you solve their specific problems.
3. **Cultural Resonance**: Demonstrate deep understanding of the role's requirements.
4. **Unmatched Value**: Clearly articulate why you are the definitive choice.
5. **Call to Action**: A high-confidence closing.

Return response in EXACT JSON format:
{
  "coverLetter": "The full, high-fidelity cover letter text.",
  "tone": "professional",
  "wordCount": <number>,
  "keyPoints": ["Strategic Point 1", "Strategic Point 2", "Strategic Point 3"]
}

IMPORTANT:
- Use elite professional language.
- Avoid generic cliches.
- Focus on storytelling and problem-solving.
- Return ONLY valid JSON.
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

    const data = JSON.parse(jsonMatch[0]) as CoverLetterResponse;

    return {
      coverLetter: data.coverLetter || generateFallbackCoverLetter(request),
      tone: data.tone || 'professional',
      wordCount: data.wordCount || data.coverLetter.split(' ').length,
      keyPoints: data.keyPoints || [],
    };
  } catch (error) {
    console.error('Error generating cover letter:', error);
    
    // Fallback cover letter
    return {
      coverLetter: generateFallbackCoverLetter(request),
      tone: 'professional',
      wordCount: 250,
      keyPoints: [
        'Relevant skills match',
        'Strong motivation',
        'Ready to contribute',
      ],
    };
  }
}

/**
 * Generate fallback cover letter
 */
function generateFallbackCoverLetter(request: CoverLetterRequest): string {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${request.jobTitle} position at ${request.companyName}. ${request.applicantBio}

I am particularly drawn to this opportunity because it aligns perfectly with my skills and career goals. With expertise in ${request.applicantSkills.slice(0, 3).join(', ')}, I am confident in my ability to contribute effectively to your team.

The requirements you've outlined for this position match well with my background. I am especially excited about the opportunity to apply my knowledge and grow professionally in a dynamic environment like ${request.companyName}.

I am eager to bring my passion, dedication, and technical skills to your organization. I would welcome the opportunity to discuss how my background and enthusiasm can benefit your team.

Thank you for considering my application. I look forward to the possibility of contributing to ${request.companyName}'s success.

Sincerely,
${request.applicantName}`;
}

