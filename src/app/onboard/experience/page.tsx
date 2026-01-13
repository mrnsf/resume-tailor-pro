'use client';

import { useEffect, useState } from 'react';
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
import type { WorkExperience, ExperienceBullet } from '@/types';
import { formatDateRange, generateId } from '@/lib/utils';

export default function ExperiencePage() {
  const router = useRouter();
  const {
    profile,
    setOnboardingStep,
    completeOnboardingStep,
    addExperience,
    updateExperience,
    deleteExperience,
  } = useProfileStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setOnboardingStep('experience');
  }, [setOnboardingStep]);

  const handleAddExperience = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isCurrentRole = formData.get('isCurrentRole') === 'on';
    const bulletsText = formData.get('bullets') as string;

    const bullets: ExperienceBullet[] = bulletsText
      .split('\n')
      .filter((b) => b.trim())
      .map((text) => ({
        id: generateId(),
        text: text.trim(),
      }));

    const experience: Omit<WorkExperience, 'id'> = {
      company: formData.get('company') as string,
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      startDate: formData.get('startDate') as string,
      endDate: isCurrentRole ? null : (formData.get('endDate') as string),
      isCurrentRole,
      description: formData.get('description') as string,
      bullets,
      skills: (formData.get('skills') as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingId) {
      updateExperience(editingId, experience);
      setEditingId(null);
    } else {
      addExperience(experience);
    }
    setIsAdding(false);
  };

  const handleNext = () => {
    completeOnboardingStep('experience');
    router.push('/onboard/education');
  };

  const handleBack = () => {
    router.push('/onboard');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Add your work history. Include specific achievements with metrics when
            possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.experience.length === 0 && !isAdding && (
            <p className="text-muted-foreground text-center py-8">
              No experience added yet. Click below to add your first role.
            </p>
          )}

          {profile.experience.map((exp) => (
            <div
              key={exp.id}
              className="border rounded-lg p-4 mb-4 bg-muted/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.title} - {exp.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentRole)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(exp.id);
                      setIsAdding(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteExperience(exp.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.bullets.map((bullet) => (
                  <li key={bullet.id} className="text-sm flex gap-2">
                    <span>•</span>
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {isAdding && (
            <form onSubmit={handleAddExperience} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    name="company"
                    defaultValue={
                      editingId
                        ? profile.experience.find((e) => e.id === editingId)?.company
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={
                      editingId
                        ? profile.experience.find((e) => e.id === editingId)?.title
                        : ''
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={
                      editingId
                        ? profile.experience.find((e) => e.id === editingId)?.location
                        : ''
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="month"
                    defaultValue={
                      editingId
                        ? profile.experience.find((e) => e.id === editingId)?.startDate
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="month"
                    defaultValue={
                      editingId
                        ? profile.experience.find((e) => e.id === editingId)?.endDate || ''
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrentRole"
                  name="isCurrentRole"
                  defaultChecked={
                    editingId
                      ? profile.experience.find((e) => e.id === editingId)?.isCurrentRole
                      : false
                  }
                />
                <Label htmlFor="isCurrentRole">I currently work here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bullets">Achievements (one per line)</Label>
                <Textarea
                  id="bullets"
                  name="bullets"
                  defaultValue={
                    editingId
                      ? profile.experience
                          .find((e) => e.id === editingId)
                          ?.bullets.map((b) => b.text)
                          .join('\n')
                      : ''
                  }
                  placeholder="Led team of 5 engineers to deliver project 2 weeks early&#10;Reduced API response time by 40% through optimization&#10;Mentored 3 junior developers"
                  className="min-h-[120px]"
                />
                <p className="text-sm text-muted-foreground">
                  Start with action verbs. Include metrics when possible.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills Used (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  defaultValue={
                    editingId
                      ? profile.experience.find((e) => e.id === editingId)?.skills.join(', ')
                      : ''
                  }
                  placeholder="Python, React, AWS, PostgreSQL"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Add'} Experience
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {!isAdding && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setIsAdding(true)}
            >
              + Add Experience
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>Next: Education</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
