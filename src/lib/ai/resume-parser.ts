import * as mammoth from 'mammoth';

// Polyfills for pdf-parse in Node.js environment to prevent ReferenceErrors
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) (global as any).DOMMatrix = class DOMMatrix {};
  if (!(global as any).ImageData) (global as any).ImageData = class ImageData {};
  if (!(global as any).Path2D) (global as any).Path2D = class Path2D {};
}

const pdf = require('pdf-parse');

interface ResumeParseResult {
  text: string;
  wordCount: number;
  pageCount?: number;
}

/**
 * Extract text from PDF buffer
 */
async function parsePDF(buffer: Buffer): Promise<ResumeParseResult> {
  let parser;
  try {
    parser = new pdf.PDFParse({ 
      data: buffer,
      disableWorker: true,
      verbosity: 0
    });
    await parser.load();
    
    const textResult = await parser.getText();
    const info = await parser.getInfo();
    
    return {
      text: textResult.text,
      wordCount: textResult.text.split(/\s+/).length,
      pageCount: info.total,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is not password protected.');
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

/**
 * Extract text from DOCX buffer
 */
async function parseDOCX(buffer: Buffer): Promise<ResumeParseResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;
    return {
      text,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Parse resume file and extract text
 * Supports: PDF, DOCX, TXT
 */
export async function parseResume(
  buffer: Buffer,
  mimeType: string
): Promise<ResumeParseResult> {
  try {
    // Handle PDF files
    if (mimeType === 'application/pdf') {
      return await parsePDF(buffer);
    }

    // Handle DOCX files
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return await parseDOCX(buffer);
    }

    // Handle plain text files
    if (mimeType === 'text/plain') {
      const text = buffer.toString('utf-8');
      return {
        text,
        wordCount: text.split(/\s+/).length,
      };
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}

/**
 * Extract key sections from resume text
 */
export function extractResumeSections(text: string): {
  education?: string;
  experience?: string;
  skills?: string;
  contact?: string;
} {
  const sections: Record<string, string> = {};

  // Common section headers
  const educationKeywords = /(?:education|academic|degree|university|college)/i;
  const experienceKeywords = /(?:experience|employment|work history|professional)/i;
  const skillsKeywords = /(?:skills|technical|competencies|technologies)/i;
  const contactKeywords = /(?:contact|email|phone|address)/i;

  const lines = text.split('\n');
  let currentSection = '';
  let sectionContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) continue;

    // Check if line is a section header
    if (educationKeywords.test(trimmedLine) && trimmedLine.length < 50) {
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join('\n');
      }
      currentSection = 'education';
      sectionContent = [];
    } else if (experienceKeywords.test(trimmedLine) && trimmedLine.length < 50) {
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join('\n');
      }
      currentSection = 'experience';
      sectionContent = [];
    } else if (skillsKeywords.test(trimmedLine) && trimmedLine.length < 50) {
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join('\n');
      }
      currentSection = 'skills';
      sectionContent = [];
    } else if (contactKeywords.test(trimmedLine) && trimmedLine.length < 50) {
      if (currentSection && sectionContent.length > 0) {
        sections[currentSection] = sectionContent.join('\n');
      }
      currentSection = 'contact';
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(trimmedLine);
    }
  }

  // Add last section
  if (currentSection && sectionContent.length > 0) {
    sections[currentSection] = sectionContent.join('\n');
  }

  return sections;
}

