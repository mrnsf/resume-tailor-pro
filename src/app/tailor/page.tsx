'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfileStore } from '@/store/profile-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { TailorSettings } from '@/types';

export default function TailorPage() {
  const router = useRouter();
  const { profile } = useProfileStore();

  const [jobDescription, setJobDescription] = useState('');
  const [settings, setSettings] = useState<TailorSettings>({
    tone: 'balanced',
    pageMode: '1-page',
    includeCoverLetter: true,
    coverLetterTone: 'direct',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Store the job description and settings in sessionStorage for the review page
    sessionStorage.setItem('tailorJobDescription', jobDescription);
    sessionStorage.setItem('tailorSettings', JSON.stringify(settings));

    router.push('/tailor/review');
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Please complete your profile first.</p>
            <Link href="/onboard">
              <Button className="mt-4">Go to Onboarding</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tailor Resume</h1>
            <p className="text-muted-foreground">
              Paste a job description to generate a tailored resume
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the complete job posting including requirements and responsibilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer to join our team...

Requirements:
- 5+ years of experience in Python
- Experience with distributed systems
- Strong communication skills"
              className="min-h-[300px] font-mono text-sm"
            />
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Tailoring Tone</Label>
              <div className="flex gap-4">
                {(['conservative', 'balanced', 'aggressive'] as const).map((tone) => (
                  <label key={tone} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tone"
                      checked={settings.tone === tone}
                      onChange={() => setSettings({ ...settings, tone })}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{tone}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Conservative: Minimal changes. Balanced: Moderate optimization. Aggressive: Maximum keyword matching.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Page Mode</Label>
              <div className="flex gap-4">
                {(['1-page', '2-page'] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pageMode"
                      checked={settings.pageMode === mode}
                      onChange={() => setSettings({ ...settings, pageMode: mode })}
                      className="w-4 h-4"
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includeCoverLetter}
                  onChange={(e) =>
                    setSettings({ ...settings, includeCoverLetter: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>Include Cover Letter</span>
              </label>

              {settings.includeCoverLetter && (
                <div className="ml-6 mt-2">
                  <Label>Cover Letter Tone</Label>
                  <div className="flex gap-4 mt-1">
                    {(['direct', 'warm', 'formal'] as const).map((tone) => (
                      <label key={tone} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="coverLetterTone"
                          checked={settings.coverLetterTone === tone}
                          onChange={() =>
                            setSettings({ ...settings, coverLetterTone: tone })
                          }
                          className="w-4 h-4"
                        />
                        <span className="capitalize">{tone}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleTailor}
            disabled={isProcessing || !jobDescription.trim()}
            className="text-lg px-8"
          >
            {isProcessing ? 'Processing...' : 'Generate Tailored Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
}
