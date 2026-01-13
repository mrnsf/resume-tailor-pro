// Master Profile Types - Source of Truth for Resume Tailoring

export interface MasterProfile {
  id: string;
  createdAt: string;
  updatedAt: string;

  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  publications: Publication[];
  languages: Language[];
  volunteer: VolunteerExperience[];
  customSections: CustomSection[];
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrentRole: boolean;
  description?: string;
  bullets: ExperienceBullet[];
  skills: string[];
}

export interface ExperienceBullet {
  id: string;
  text: string;
  metrics?: string[];
  keywords?: string[];
  impact?: 'high' | 'medium' | 'low';
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string | null;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
  activities?: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsUsed?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  url?: string;
  repoUrl?: string;
  bullets: string[];
  technologies: string[];
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  coAuthors?: string[];
}

export interface Language {
  name: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: { id: string; text: string }[];
}

// Tailoring Types
export interface TailorSettings {
  tone: 'conservative' | 'balanced' | 'aggressive';
  pageMode: '1-page' | '2-page';
  includeCoverLetter: boolean;
  coverLetterTone?: 'direct' | 'warm' | 'formal';
}

export interface JobSignals {
  title: string;
  company: string | null;
  mustHave: string[];
  niceToHave: string[];
  responsibilities: string[];
  keywords: string[];
  softSkills: string[];
  yearsExperience: number | null;
  educationLevel: string | null;
}

export interface TailorChange {
  id: string;
  section: 'experience' | 'education' | 'skills' | 'projects' | 'summary';
  itemId: string;
  changeType: 'include' | 'rewrite' | 'reorder' | 'highlight';
  originalText: string;
  suggestedText: string;
  reason: string;
  jobKeywords: string[];
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected' | 'edited';
  userEditedText?: string;
}

export interface KeywordCoverage {
  present: string[];
  implied: { keyword: string; evidence: string }[];
  missing: string[];
}

export interface TailoringResult {
  changes: TailorChange[];
  keywordCoverage: KeywordCoverage;
  selectedExperiences: string[];
  selectedProjects: string[];
  skillsToHighlight: string[];
  coverLetter?: {
    text: string;
    claims: { claim: string; evidence: string }[];
  };
  generatedLatex: string;
}

export interface TailoringHistoryItem {
  id: string;
  jobTitle: string;
  company: string;
  createdAt: string;
  jobDescription: string;
  settings: TailorSettings;
  result: TailoringResult;
}

// Onboarding Types
export type OnboardingStep =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects';

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isComplete: boolean;
}
