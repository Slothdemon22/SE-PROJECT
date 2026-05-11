import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import Groq from 'groq-sdk';

interface ProfileRatingResponse {
  rating: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if API key is configured
    if (!process.env.API_KEY) {
      return NextResponse.json(
        { error: 'API_KEY is not configured for Groq' },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.API_KEY });

    // Fetch user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        fullName: true,
        email: true,
        bio: true,
        skills: true,
        interests: true,
        role: true,
        department: true,
        year: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profileContext = `
# Persona: Senior Talent Strategist & Performance Coach (Elite Tier)

You are a world-class Talent Strategist who has reviewed thousands of high-stakes resumes and elite professional profiles. Your goal is to provide a surgical, unforgiving, and brutally honest critique of the following profile. 

Do NOT be "nice." Do NOT give high scores easily. A score above 7/10 should only be reserved for world-class, complete, and highly optimized profiles. If the profile is generic, sparse, or lacks a clear value proposition, penalize it heavily.

### APPLICANT PROFILE DATA:
- Full Name: ${profile.fullName || 'NOT PROVIDED'}
- Ecosystem Role: ${profile.role === 'SEEKER' ? 'Talent Seeker (Active)' : 'Talent Finder (Strategic)'}
- Primary Department: ${profile.department || 'NOT PROVIDED'}
- Academic Standing: ${profile.year || 'NOT PROVIDED'}
- Professional Bio: ${profile.bio || 'NOT PROVIDED'}
- Expert Skills: ${profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : 'NO SKILLS LISTED'}
- Strategic Interests: ${profile.interests && profile.interests.length > 0 ? profile.interests.join(', ') : 'NO INTERESTS LISTED'}
- Calculated System Completeness: ${calculateProfileCompleteness(profile)}%

### CRITIQUE PARAMETERS:
1. **Rigorous Rating**: Provide an overall score out of 10. Be conservative. 1-3 is poor, 4-6 is mediocre/generic, 7-8 is strong, 9-10 is world-class.
2. **Brutal Summary**: A 2-3 sentence executive summary that cuts straight to the core weakness of the profile.
3. **Genuine Strengths**: 3 points that actually work, if any.
4. **Critical Improvements**: 3 surgical recommendations that would actually move the needle for a high-tier recruiter.
5. **High-Stakes Feedback**: A detailed, high-fidelity paragraph on how to transform this profile from a generic entry into an elite professional brand.

Format your response EXACTLY as JSON:
{
  "rating": <number 1-10>,
  "summary": "<surgical weakness summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "feedback": "<detailed strategic narrative feedback>"
}
`;

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: profileContext }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    
    const text = chatCompletion.choices[0].message.content || '{}';

    // Parse the AI response
    let aiResponse: ProfileRatingResponse;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      // Fallback response if parsing fails
      aiResponse = {
        rating: 5,
        summary: 'Unable to generate detailed analysis at this time.',
        strengths: ['Profile exists', 'Account is active', 'Basic information provided'],
        improvements: ['Add more details to bio', 'List more skills', 'Expand interests'],
        feedback: text.substring(0, 500), // Use raw response as feedback
      };
    }

    // Validate rating is between 1-10
    if (aiResponse.rating < 1 || aiResponse.rating > 10) {
      aiResponse.rating = Math.max(1, Math.min(10, aiResponse.rating));
    }

    return NextResponse.json({
      success: true,
      data: {
        rating: aiResponse.rating,
        summary: aiResponse.summary,
        strengths: aiResponse.strengths || [],
        improvements: aiResponse.improvements || [],
        feedback: aiResponse.feedback,
        profileCompleteness: calculateProfileCompleteness(profile),
      },
    });

  } catch (error) {
    console.error('Error rating profile:', error);
    return NextResponse.json(
      { 
        error: 'Failed to rate profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate profile completeness
function calculateProfileCompleteness(profile: {
  fullName: string | null;
  bio: string | null;
  skills: string[];
  interests: string[];
  department: string | null;
  year: string | null;
}): number {
  let completeness = 0;
  const fields = [
    { value: profile.fullName, weight: 15 },
    { value: profile.bio, weight: 20 },
    { value: profile.skills && profile.skills.length > 0, weight: 25 },
    { value: profile.interests && profile.interests.length > 0, weight: 20 },
    { value: profile.department, weight: 10 },
    { value: profile.year, weight: 10 },
  ];

  fields.forEach(field => {
    if (field.value) {
      completeness += field.weight;
    }
  });

  return Math.round(completeness);
}

