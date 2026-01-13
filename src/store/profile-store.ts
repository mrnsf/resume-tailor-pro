import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MasterProfile,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillCategory,
  Certification,
  Project,
  OnboardingStep,
  OnboardingState,
} from '@/types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createEmptyProfile(): MasterProfile {
  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    awards: [],
    publications: [],
    languages: [],
    volunteer: [],
    customSections: [],
  };
}

interface ProfileStore {
  // Profile state
  profile: MasterProfile | null;
  isOnboarded: boolean;

  // Onboarding state
  onboarding: OnboardingState;

  // Profile actions
  initializeProfile: () => void;
  setProfile: (profile: MasterProfile) => void;
  updatePersonal: (personal: Partial<PersonalInfo>) => void;

  // Experience actions
  addExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
  deleteExperience: (id: string) => void;

  // Education actions
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;

  // Skills actions
  addSkillCategory: (category: Omit<SkillCategory, 'id'>) => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategory>) => void;
  deleteSkillCategory: (id: string) => void;

  // Certification actions
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Onboarding actions
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;

  // Export/Import
  exportProfile: () => string;
  importProfile: (json: string) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,
      onboarding: {
        currentStep: 'personal',
        completedSteps: [],
        isComplete: false,
      },

      initializeProfile: () => {
        if (!get().profile) {
          set({ profile: createEmptyProfile() });
        }
      },

      setProfile: (profile) =>
        set({
          profile: { ...profile, updatedAt: new Date().toISOString() },
          isOnboarded: true,
        }),

      updatePersonal: (personal) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                personal: { ...state.profile.personal, ...personal },
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // Experience
      addExperience: (exp) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                experience: [
                  ...state.profile.experience,
                  { ...exp, id: generateId() },
                ],
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                experience: state.profile.experience.map((e) =>
                  e.id === id ? { ...e, ...exp } : e
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      deleteExperience: (id) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                experience: state.profile.experience.filter((e) => e.id !== id),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // Education
      addEducation: (edu) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                education: [
                  ...state.profile.education,
                  { ...edu, id: generateId() },
                ],
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                education: state.profile.education.map((e) =>
                  e.id === id ? { ...e, ...edu } : e
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      deleteEducation: (id) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                education: state.profile.education.filter((e) => e.id !== id),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // Skills
      addSkillCategory: (category) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                skills: [
                  ...state.profile.skills,
                  { ...category, id: generateId() },
                ],
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateSkillCategory: (id, category) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                skills: state.profile.skills.map((s) =>
                  s.id === id ? { ...s, ...category } : s
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      deleteSkillCategory: (id) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                skills: state.profile.skills.filter((s) => s.id !== id),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // Certifications
      addCertification: (cert) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                certifications: [
                  ...state.profile.certifications,
                  { ...cert, id: generateId() },
                ],
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateCertification: (id, cert) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                certifications: state.profile.certifications.map((c) =>
                  c.id === id ? { ...c, ...cert } : c
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      deleteCertification: (id) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                certifications: state.profile.certifications.filter(
                  (c) => c.id !== id
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // Projects
      addProject: (project) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                projects: [
                  ...state.profile.projects,
                  { ...project, id: generateId() },
                ],
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      updateProject: (id, project) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                projects: state.profile.projects.map((p) =>
                  p.id === id ? { ...p, ...project } : p
                ),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      deleteProject: (id) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                projects: state.profile.projects.filter((p) => p.id !== id),
                updatedAt: new Date().toISOString(),
              }
            : null,
        })),

      // Onboarding
      setOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, currentStep: step },
        })),

      completeOnboardingStep: (step) =>
        set((state) => ({
          onboarding: {
            ...state.onboarding,
            completedSteps: state.onboarding.completedSteps.includes(step)
              ? state.onboarding.completedSteps
              : [...state.onboarding.completedSteps, step],
          },
        })),

      completeOnboarding: () =>
        set({
          onboarding: {
            currentStep: 'personal',
            completedSteps: [
              'personal',
              'experience',
              'education',
              'skills',
              'certifications',
              'projects',
            ],
            isComplete: true,
          },
          isOnboarded: true,
        }),

      // Export/Import
      exportProfile: () => JSON.stringify(get().profile, null, 2),

      importProfile: (json) => {
        try {
          const profile = JSON.parse(json) as MasterProfile;
          set({ profile, isOnboarded: true });
        } catch {
          throw new Error('Invalid profile JSON');
        }
      },

      clearProfile: () =>
        set({
          profile: null,
          isOnboarded: false,
          onboarding: {
            currentStep: 'personal',
            completedSteps: [],
            isComplete: false,
          },
        }),
    }),
    {
      name: 'resumeTailor_masterProfile',
    }
  )
);
