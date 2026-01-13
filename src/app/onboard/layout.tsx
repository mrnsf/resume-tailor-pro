'use client';

import { useProfileStore } from '@/store/profile-store';
import { Progress } from '@/components/ui/progress';
import type { OnboardingStep } from '@/types';

const STEPS: { id: OnboardingStep; label: string }[] = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
];

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onboarding } = useProfileStore();

  const currentStepIndex = STEPS.findIndex(
    (step) => step.id === onboarding.currentStep
  );
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Resume Tailor Pro
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Build your Master Profile - the source of truth for all your
            tailored resumes
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Step {currentStepIndex + 1} of {STEPS.length}:{' '}
                {STEPS[currentStepIndex]?.label}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStepIndex
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
