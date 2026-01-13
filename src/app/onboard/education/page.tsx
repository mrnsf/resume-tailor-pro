'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profile-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Education } from '@/types';
import { formatDateRange } from '@/lib/utils';

export default function EducationPage() {
  const router = useRouter();
  const {
    profile,
    setOnboardingStep,
    completeOnboardingStep,
    addEducation,
    updateEducation,
    deleteEducation,
  } = useProfileStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setOnboardingStep('education');
  }, [setOnboardingStep]);

  const handleAddEducation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const education: Omit<Education, 'id'> = {
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      field: formData.get('field') as string,
      location: formData.get('location') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || null,
      gpa: formData.get('gpa') as string,
      honors: (formData.get('honors') as string)
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean),
      relevantCoursework: (formData.get('coursework') as string)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    };

    if (editingId) {
      updateEducation(editingId, education);
      setEditingId(null);
    } else {
      addEducation(education);
    }
    setIsAdding(false);
  };

  const handleNext = () => {
    completeOnboardingStep('education');
    router.push('/onboard/skills');
  };

  const handleBack = () => {
    router.push('/onboard/experience');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Add your educational background
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.education.length === 0 && !isAdding && (
            <p className="text-muted-foreground text-center py-8">
              No education added yet. Click below to add.
            </p>
          )}

          {profile.education.map((edu) => (
            <div
              key={edu.id}
              className="border rounded-lg p-4 mb-4 bg-muted/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.institution}</h3>
                  <p className="text-sm">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(edu.startDate, edu.endDate)}
                    {edu.gpa && ` - GPA: ${edu.gpa}`}
                  </p>
                  {edu.honors && edu.honors.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Honors: {edu.honors.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(edu.id);
                      setIsAdding(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEducation(edu.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {isAdding && (
            <form onSubmit={handleAddEducation} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    name="institution"
                    defaultValue={
                      editingId
                        ? profile.education.find((e) => e.id === editingId)?.institution
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    name="degree"
                    placeholder="Bachelor of Science"
                    defaultValue={
                      editingId
                        ? profile.education.find((e) => e.id === editingId)?.degree
                        : ''
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study *</Label>
                  <Input
                    id="field"
                    name="field"
                    placeholder="Computer Science"
                    defaultValue={
                      editingId
                        ? profile.education.find((e) => e.id === editingId)?.field
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={
                      editingId
                        ? profile.education.find((e) => e.id === editingId)?.location
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="month"
                    defaultValue={
                      editingId
                        ? profile.education.find((e) => e.id === editingId)?.startDate
                        : ''
                    }
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
                        ? profile.education.find((e) => e.id === editingId)?.endDate || ''
                        : ''
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    name="gpa"
                    placeholder="3.8"
                    defaultValue={
                      editingId
                        ? profile.education.find((e) => e.id === editingId)?.gpa
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="honors">Honors (comma-separated)</Label>
                <Input
                  id="honors"
                  name="honors"
                  placeholder="Magna Cum Laude, Dean's List"
                  defaultValue={
                    editingId
                      ? profile.education.find((e) => e.id === editingId)?.honors?.join(', ')
                      : ''
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coursework">Relevant Coursework (comma-separated)</Label>
                <Input
                  id="coursework"
                  name="coursework"
                  placeholder="Data Structures, Algorithms, Machine Learning"
                  defaultValue={
                    editingId
                      ? profile.education.find((e) => e.id === editingId)?.relevantCoursework?.join(', ')
                      : ''
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Add'} Education
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
              + Add Education
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>Next: Skills</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
