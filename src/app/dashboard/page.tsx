'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfileStore } from '@/store/profile-store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isOnboarded, exportProfile, clearProfile } = useProfileStore();

  useEffect(() => {
    if (!isOnboarded) {
      router.push('/onboard');
    }
  }, [isOnboarded, router]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Calculate profile strength
  const calculateStrength = () => {
    let score = 0;
    let total = 0;

    // Personal info
    total += 4;
    if (profile.personal.fullName) score++;
    if (profile.personal.email) score++;
    if (profile.personal.location) score++;
    if (profile.personal.summary) score++;

    // Experience
    total += 2;
    if (profile.experience.length > 0) score++;
    if (profile.experience.some((e) => e.bullets.length >= 3)) score++;

    // Education
    total += 1;
    if (profile.education.length > 0) score++;

    // Skills
    total += 2;
    if (profile.skills.length > 0) score++;
    if (profile.skills.some((c) => c.skills.length >= 3)) score++;

    // Projects
    total += 1;
    if (profile.projects.length > 0) score++;

    return Math.round((score / total) * 100);
  };

  const strength = calculateStrength();

  const handleExport = () => {
    const data = exportProfile();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'master-profile.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all profile data? This cannot be undone.')) {
      clearProfile();
      router.push('/onboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Resume Tailor Pro</h1>
            <p className="text-muted-foreground">Your Master Profile Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              Export Profile
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearData}>
              Clear Data
            </Button>
          </div>
        </div>

        {/* Profile Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {profile.personal.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profile.personal.fullName}</h2>
                <p className="text-muted-foreground">
                  {profile.personal.email} - {profile.personal.location}
                </p>
              </div>
              <Link href="/onboard">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Profile Strength */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Profile Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={strength} className="flex-1" />
              <span className="text-lg font-semibold">{strength}%</span>
            </div>
            {strength < 100 && (
              <p className="text-sm text-muted-foreground mt-2">
                Add more details to strengthen your profile for better tailoring results.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {profile.experience.length}
              </div>
              <div className="text-sm text-muted-foreground">Experiences</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {profile.education.length}
              </div>
              <div className="text-sm text-muted-foreground">Education</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {profile.skills.reduce((acc, cat) => acc + cat.skills.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {profile.certifications.length}
              </div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">
                {profile.projects.length}
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </CardContent>
          </Card>
        </div>

        {/* Tailor CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Tailor?</h2>
              <p className="text-muted-foreground mb-4">
                Paste a job description and get a perfectly tailored resume in seconds.
              </p>
              <Link href="/tailor">
                <Button size="lg" className="text-lg px-8">
                  Tailor for a New Job
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
