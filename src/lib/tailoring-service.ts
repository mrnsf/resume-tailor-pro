import { callDeepSeekJSON, callDeepSeek } from './deepseek';
import type {
  MasterProfile,
  TailorSettings,
  TailoringResult,
  JobSignals,
  TailorChange,
  KeywordCoverage,
} from '@/types';
import { generateId } from './utils';

export async function extractJobSignals(jobDescription: string): Promise<JobSignals> {
  return callDeepSeekJSON<JobSignals>([
    {
      role: 'system',
      content: `You extract structured requirements from job descriptions.

Return JSON with these fields:
- title: string (job title)
- company: string | null (company name if mentioned)
- mustHave: string[] (explicitly required skills/qualifications)
- niceToHave: string[] (preferred but optional)
- responsibilities: string[] (key job duties)
- keywords: string[] (technical terms, tools, methodologies)
- softSkills: string[] (communication, leadership, etc.)
- yearsExperience: number | null
- educationLevel: string | null

Be precise. Only include what's actually stated.`,
    },
    {
      role: 'user',
      content: `Extract job signals from this posting:\n\n${jobDescription}`,
    },
  ]);
}

export async function generateTailoringChanges(
  profile: MasterProfile,
  jobSignals: JobSignals,
  settings: TailorSettings
): Promise<{
  changes: TailorChange[];
  keywordCoverage: KeywordCoverage;
  selectedExperiences: string[];
  selectedProjects: string[];
  skillsToHighlight: string[];
}> {
  const systemPrompt = `You are a resume optimization expert. Your task is to suggest how to tailor a resume for a specific job.

# ABSOLUTE RULES - YOU MUST FOLLOW THESE

## Source of Truth
The Master Profile provided is the ONLY source of facts. You may ONLY use information that exists in the profile.

## What You CAN Do:
- SELECT which experiences/bullets to include (most relevant to job)
- REORDER items to prioritize relevance
- REWRITE bullets for clarity while preserving meaning
- HIGHLIGHT skills that match job requirements

## What You CANNOT Do:
- INVENT metrics, numbers, or achievements not in the profile
- ADD tools/technologies not listed in skills or mentioned in experience
- CREATE new responsibilities not described in the profile
- EXAGGERATE claims in any way

## Output Format
Return JSON with:
{
  "changes": [
    {
      "section": "experience|education|skills|projects|summary",
      "itemId": "id from profile",
      "changeType": "include|rewrite|reorder|highlight",
      "originalText": "exact text from profile",
      "suggestedText": "your suggestion",
      "reason": "why this helps for this job",
      "jobKeywords": ["matched", "keywords"],
      "riskLevel": "low|medium|high"
    }
  ],
  "keywordCoverage": {
    "present": ["skills that match job"],
    "implied": [{"keyword": "x", "evidence": "profile shows..."}],
    "missing": ["required skills not in profile"]
  },
  "selectedExperiences": ["ids of experiences to include"],
  "selectedProjects": ["ids of projects to include"],
  "skillsToHighlight": ["skills most relevant to job"]
}

Risk levels:
- low: Minor rewording for clarity
- medium: Significant restructuring or keyword emphasis
- high: Major changes that could be seen as stretching the truth`;

  const userPrompt = `# Master Profile (Source of Truth)
${JSON.stringify(profile, null, 2)}

# Job Requirements
${JSON.stringify(jobSignals, null, 2)}

# Settings
- Tone: ${settings.tone}
- Page Mode: ${settings.pageMode}

Generate tailoring suggestions following the rules exactly.`;

  const result = await callDeepSeekJSON<{
    changes: Omit<TailorChange, 'id' | 'status'>[];
    keywordCoverage: KeywordCoverage;
    selectedExperiences: string[];
    selectedProjects: string[];
    skillsToHighlight: string[];
  }>([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  // Add IDs and status to changes
  const changes: TailorChange[] = result.changes.map((change) => ({
    ...change,
    id: generateId(),
    status: 'pending',
  }));

  return {
    ...result,
    changes,
  };
}

export async function generateCoverLetter(
  profile: MasterProfile,
  jobSignals: JobSignals,
  settings: TailorSettings
): Promise<{ text: string; claims: { claim: string; evidence: string }[] }> {
  const systemPrompt = `You write cover letters that are compelling yet truthful.

# RULES
1. Every claim must be backed by evidence from the profile
2. Do NOT invent accomplishments or metrics
3. Keep to 3-4 paragraphs
4. Match the requested tone: ${settings.coverLetterTone || 'direct'}
5. Don't start with "I am writing to apply..."
6. Be specific about why this candidate is a good fit

# OUTPUT FORMAT
{
  "text": "The full cover letter",
  "claims": [
    {"claim": "statement in the letter", "evidence": "quote from profile supporting it"}
  ]
}

Every factual statement should be in the claims array with evidence.`;

  return callDeepSeekJSON([
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Profile:\n${JSON.stringify(profile, null, 2)}\n\nJob:\n${JSON.stringify(jobSignals, null, 2)}`,
    },
  ]);
}

export async function generateLatex(
  profile: MasterProfile,
  selectedExperiences: string[],
  selectedProjects: string[],
  skillsToHighlight: string[],
  changes: TailorChange[],
  settings: TailorSettings
): Promise<string> {
  const acceptedChanges = changes.filter(
    (c) => c.status === 'accepted' || c.status === 'edited'
  );

  const systemPrompt = `You generate clean LaTeX resumes using the Jake's Resume template style.

Generate a complete, compilable LaTeX document. Use this exact structure:

\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

Include custom commands for resumeSubheading, resumeItem, etc.
Make it ATS-friendly and professional.
${settings.pageMode === '1-page' ? 'Keep it to one page.' : 'Can extend to two pages if needed.'}

Return ONLY the LaTeX code, no explanation or markdown.`;

  const content = await callDeepSeek([
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Generate LaTeX resume.

Profile: ${JSON.stringify(profile, null, 2)}

Selected experiences: ${JSON.stringify(selectedExperiences)}
Selected projects: ${JSON.stringify(selectedProjects)}
Skills to highlight: ${JSON.stringify(skillsToHighlight)}
Changes to apply: ${JSON.stringify(acceptedChanges)}`,
    },
  ]);

  return content;
}

export async function tailorResume(
  profile: MasterProfile,
  jobDescription: string,
  settings: TailorSettings
): Promise<TailoringResult> {
  // Step 1: Extract job signals
  const jobSignals = await extractJobSignals(jobDescription);

  // Step 2: Generate tailoring suggestions
  const tailoringData = await generateTailoringChanges(profile, jobSignals, settings);

  // Step 3: Generate cover letter if requested
  let coverLetter;
  if (settings.includeCoverLetter) {
    coverLetter = await generateCoverLetter(profile, jobSignals, settings);
  }

  // Step 4: Generate LaTeX (with all changes pending for now)
  const generatedLatex = await generateLatex(
    profile,
    tailoringData.selectedExperiences,
    tailoringData.selectedProjects,
    tailoringData.skillsToHighlight,
    tailoringData.changes,
    settings
  );

  return {
    changes: tailoringData.changes,
    keywordCoverage: tailoringData.keywordCoverage,
    selectedExperiences: tailoringData.selectedExperiences,
    selectedProjects: tailoringData.selectedProjects,
    skillsToHighlight: tailoringData.skillsToHighlight,
    coverLetter,
    generatedLatex,
  };
}
