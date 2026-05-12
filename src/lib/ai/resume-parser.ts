import * as mammoth from 'mammoth';

// Polyfills for pdf-parse in Node.js environment to prevent ReferenceErrors
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) (global as any).DOMMatrix = class DOMMatrix {};
  if (!(global as any).ImageData) (global as any).ImageData = class ImageData {};
  if (!(global as any).Path2D) (global as any).Path2D = class Path2D {};
}

const pdfParseModule = require('pdf-parse');

interface ResumeParseResult {
  text: string;
  wordCount: number;
  pageCount?: number;
}

/**
 * Extract text from PDF buffer
 */
async function parsePDF(buffer: Buffer): Promise<ResumeParseResult> {
  try {
    // pdf-parse v2 exports a class (PDFParse), while v1 exported a callable function.
    const PDFParseCtor =
      pdfParseModule?.PDFParse ??
      pdfParseModule?.default?.PDFParse ??
      null;
    const legacyPdfParse =
      typeof pdfParseModule === 'function'
        ? pdfParseModule
        : typeof pdfParseModule?.default === 'function'
          ? pdfParseModule.default
          : null;

    let text = '';
    let pageCount: number | undefined;

    if (typeof PDFParseCtor === 'function') {
      const parser = new PDFParseCtor({ data: buffer });
      try {
        const result = await parser.getText();
        text = (result?.text || '').trim();
        pageCount = typeof result?.total === 'number' ? result.total : undefined;
      } finally {
        await parser.destroy().catch(() => undefined);
      }
    } else if (typeof legacyPdfParse === 'function') {
      const result = await legacyPdfParse(buffer);
      text = (result?.text || '').trim();
      pageCount = typeof result?.numpages === 'number' ? result.numpages : undefined;
    } else {
      throw new Error('Unsupported pdf-parse export shape');
    }

    if (!text) {
      throw new Error('No text extracted from PDF');
    }

    return {
      text,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      pageCount,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is not password protected.');
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
  mimeType: string,
  fileName?: string
): Promise<ResumeParseResult> {
  try {
    const normalizedMimeType = (mimeType || '').toLowerCase();
    const normalizedFileName = (fileName || '').toLowerCase();

    // Handle PDF files
    if (
      normalizedMimeType === 'application/pdf' ||
      normalizedFileName.endsWith('.pdf')
    ) {
      return await parsePDF(buffer);
    }

    // Handle DOCX files
    if (
      normalizedMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      normalizedMimeType === 'application/msword' ||
      normalizedFileName.endsWith('.docx') ||
      normalizedFileName.endsWith('.doc')
    ) {
      return await parseDOCX(buffer);
    }

    // Handle plain text files
    if (normalizedMimeType === 'text/plain' || normalizedFileName.endsWith('.txt')) {
      const text = buffer.toString('utf-8');
      return {
        text,
        wordCount: text.split(/\s+/).filter(Boolean).length,
      };
    }

    throw new Error(`Unsupported file type: ${mimeType || fileName || 'unknown'}`);
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

