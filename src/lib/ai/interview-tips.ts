import Groq from 'groq-sdk';

interface InterviewTipsRequest {
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  applicantSkills: string[];
  applicantExperience?: string;
}

export interface InterviewTipsResponse {
  commonQuestions: Array<{
    question: string;
    suggestedAnswer: string;
    tips: string;
  }>;
  keyPointsToHighlight: string[];
  thingsToAvoid: string[];
  preparationChecklist: string[];
  overallAdvice: string;
}

/**
 * Generate AI-powered interview tips
 */
export async function generateInterviewTips(
  request: InterviewTipsRequest
): Promise<InterviewTipsResponse> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API_KEY not configured');
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are an elite Performance Coach and High-Stakes Interview Strategist. Your mission is to prepare the candidate to deliver a world-class interview performance for this specific role.

JOB CONTEXT:
- Position: ${request.jobTitle}
- Objective: ${request.jobDescription}
- Requirements: ${request.requirements}

CANDIDATE STRENGTHS:
- Skills: ${request.applicantSkills.join(', ')}
${request.applicantExperience ? `- Background: ${request.applicantExperience}` : ''}

COACHING PROTOCOL:
1. **Psychological Preparation**: Identify 5-7 high-impact, role-specific questions and provide "Winner's Framework" answers.
2. **Value Mapping**: Highlight 3-5 strategic points the candidate must weave into their narrative.
3. **Pitfall Avoidance**: Identify subtle "red flag" behaviors specific to this industry or role.
4. **The Final Countdown**: Provide a rigorous preparation checklist for the 24 hours leading up to the interview.
5. **Executive Advice**: A final strategic briefing to settle nerves and sharpen focus.

Return response in this EXACT JSON format:
{
  "commonQuestions": [
    {
      "question": "High-impact question",
      "suggestedAnswer": "Strategic narrative framework",
      "tips": "Psychological approach to this question"
    }
  ],
  "keyPointsToHighlight": ["Strategic Point 1", "Strategic Point 2", ...],
  "thingsToAvoid": ["Red Flag 1", "Red Flag 2", ...],
  "preparationChecklist": ["Critical Task 1", "Critical Task 2", ...],
  "overallAdvice": "Final high-stakes coaching brief"
}

IMPORTANT:
- Focus on high-level strategy and executive presence.
- Be specific to the role's unique challenges.
- Ensure advice is actionable and sophisticated.
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

    const data = JSON.parse(jsonMatch[0]) as InterviewTipsResponse;

    return {
      commonQuestions: data.commonQuestions || [],
      keyPointsToHighlight: data.keyPointsToHighlight || [],
      thingsToAvoid: data.thingsToAvoid || [],
      preparationChecklist: data.preparationChecklist || [],
      overallAdvice: data.overallAdvice || 'Prepare thoroughly and be yourself!',
    };
  } catch (error) {
    console.error('Error generating interview tips:', error);
    
    // Fallback interview tips
    return generateFallbackTips(request);
  }
}

/**
 * Generate fallback interview tips
 */
function generateFallbackTips(request: InterviewTipsRequest): InterviewTipsResponse {
  return {
    commonQuestions: [
      {
        question: 'Tell me about yourself and your background',
        suggestedAnswer: 'Provide a brief overview of your education, skills, and what makes you passionate about this field.',
        tips: 'Keep it to 2-3 minutes, focus on relevant experience',
      },
      {
        question: `Why are you interested in this ${request.jobTitle} position?`,
        suggestedAnswer: 'Express genuine interest in the role and explain how it aligns with your career goals.',
        tips: 'Show that you researched the role and company',
      },
      {
        question: 'What are your relevant skills for this position?',
        suggestedAnswer: `Highlight your skills in ${request.applicantSkills.slice(0, 3).join(', ')} and how you've applied them.`,
        tips: 'Use specific examples from your experience',
      },
      {
        question: 'What are your strengths and weaknesses?',
        suggestedAnswer: 'Choose strengths relevant to the role. For weaknesses, mention areas you are actively improving.',
        tips: 'Be honest but strategic in your response',
      },
      {
        question: 'Where do you see yourself in 5 years?',
        suggestedAnswer: 'Express goals that align with potential growth in this role.',
        tips: 'Show ambition while being realistic',
      },
    ],
    keyPointsToHighlight: [
      `Your expertise in ${request.applicantSkills[0] || 'relevant technologies'}`,
      'Your enthusiasm and motivation for the role',
      'Your ability to learn and adapt quickly',
      'Any relevant projects or achievements',
      'Your teamwork and communication skills',
    ],
    thingsToAvoid: [
      'Speaking negatively about previous employers or experiences',
      'Being unprepared with questions about the role',
      'Appearing uninterested or distracted',
      'Exaggerating or lying about your experience',
      'Failing to ask questions at the end',
    ],
    preparationChecklist: [
      'Research the company and understand their mission',
      'Review the job description and requirements thoroughly',
      'Prepare specific examples of your work and achievements',
      'Practice answering common interview questions',
      'Prepare thoughtful questions to ask the interviewer',
      'Test your technology setup if it is a virtual interview',
      'Plan your outfit and arrive/log in 10 minutes early',
    ],
    overallAdvice: `For this ${request.jobTitle} position, focus on demonstrating both your technical skills and your enthusiasm for the role. Be prepared to discuss specific examples of how you've used your skills in ${request.applicantSkills.slice(0, 2).join(' and ')}. Remember to show genuine interest, ask insightful questions, and let your personality shine through. Good luck!`,
  };
}

