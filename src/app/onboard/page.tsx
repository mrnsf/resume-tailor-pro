'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profile-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PersonalInfoPage() {
  const router = useRouter();
  const { profile, initializeProfile, updatePersonal, setOnboardingStep, completeOnboardingStep } =
    useProfileStore();

  useEffect(() => {
    initializeProfile();
    setOnboardingStep('personal');
  }, [initializeProfile, setOnboardingStep]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updatePersonal({
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      linkedin: formData.get('linkedin') as string,
      github: formData.get('github') as string,
      portfolio: formData.get('portfolio') as string,
      summary: formData.get('summary') as string,
    });

    completeOnboardingStep('personal');
    router.push('/onboard/experience');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Let&apos;s start with your basic contact information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={profile.personal.fullName}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profile.personal.email}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={profile.personal.phone}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                defaultValue={profile.personal.location}
                placeholder="San Francisco, CA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                defaultValue={profile.personal.linkedin}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                defaultValue={profile.personal.github}
                placeholder="github.com/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                name="portfolio"
                defaultValue={profile.personal.portfolio}
                placeholder="johndoe.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={profile.personal.summary}
              placeholder="Write a brief professional summary in your own words..."
              className="min-h-[120px]"
            />
            <p className="text-sm text-muted-foreground">
              This will be used as the foundation for tailored summaries
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Next: Work Experience</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
