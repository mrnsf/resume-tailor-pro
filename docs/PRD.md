# Resume Tailor Pro — Product Requirements Document

> A truth-first resume tailoring tool that optimizes without fabricating.
> **Simplified Architecture: localStorage + DeepSeek API — No backend database required.**

## Executive Summary

Resume Tailor Pro is a **client-side web application** that:
1. Onboards users to create a **Master Profile** (their complete professional history)
2. Accepts a job description
3. Generates a tailored LaTeX resume using only facts from the Master Profile
4. Produces PDFs and cover letters

**Key Design Decision:** All user data lives in **localStorage**. The AI can only reference what's in the Master Profile — it cannot invent anything.

## Problem Statement

Job seekers often struggle with:
- Manually tailoring resumes for each job application
- Accidentally exaggerating or fabricating achievements
- Keeping track of all their experiences and skills
- Generating professional-looking LaTeX resumes

## Solution

A web-based tool that:
- Stores all professional history locally in the browser
- Uses AI to intelligently select and reword content for specific jobs
- Maintains strict truth boundaries — only uses what exists in the profile
- Generates clean, ATS-friendly LaTeX resumes

## Core Features

### 1. Master Profile (Source of Truth)
- Personal information
- Work experience with bullet points
- Education history
- Skills organized by category
- Certifications
- Projects
- All stored in localStorage, persists across sessions

### 2. Onboarding Wizard
- Step-by-step profile creation
- 6 steps: Personal → Experience → Education → Skills → Certifications → Projects
- Progress indicator
- Can be revisited to update information

### 3. Tailoring Engine
- Job description input
- AI extracts requirements and keywords
- Matches profile content to job requirements
- Suggests changes with risk levels (low/medium/high)
- User reviews and approves each change

### 4. Output Generation
- LaTeX resume using Jake's Resume template
- Cover letter with evidence-backed claims
- Keyword coverage analysis
- Export to .tex file for compilation

## Technical Architecture

### Frontend
- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS for styling
- shadcn/ui components
- Zustand for state management with localStorage persistence

### External Services
- DeepSeek API for AI tailoring
- LaTeX compilation via Overleaf or local tools

### Data Storage
- All data in localStorage
- No backend database required
- Export/import functionality for backup

## User Flow

```
Landing Page
    ↓
[New User?] → Onboarding Wizard (6 steps)
    ↓
Dashboard
    ↓
[Tailor for Job] → Job Input Page
    ↓
Processing (AI analysis)
    ↓
Review Changes Page
    ↓
Export Page (download .tex, cover letter)
```

## Success Metrics

- User can complete onboarding in < 15 minutes
- Tailoring generates results in < 30 seconds
- 100% of resume content is traceable to Master Profile
- LaTeX compiles without errors

## Future Enhancements

1. PDF preview in browser
2. Resume history/versioning
3. Job application tracking
4. Chrome extension for job posting extraction
5. Multiple resume templates
