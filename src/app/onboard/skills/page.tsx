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
import type { SkillCategory, Skill } from '@/types';
import { generateId } from '@/lib/utils';

export default function SkillsPage() {
  const router = useRouter();
  const {
    profile,
    setOnboardingStep,
    completeOnboardingStep,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
  } = useProfileStore();

  const [newCategory, setNewCategory] = useState('');
  const [newSkills, setNewSkills] = useState<Record<string, string>>({});

  useEffect(() => {
    setOnboardingStep('skills');
  }, [setOnboardingStep]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    addSkillCategory({
      category: newCategory.trim(),
      skills: [],
    });
    setNewCategory('');
  };

  const handleAddSkill = (categoryId: string) => {
    const skillText = newSkills[categoryId]?.trim();
    if (!skillText) return;

    const category = profile?.skills.find((c) => c.id === categoryId);
    if (!category) return;

    const skill: Skill = {
      name: skillText,
    };

    updateSkillCategory(categoryId, {
      skills: [...category.skills, skill],
    });

    setNewSkills((prev) => ({ ...prev, [categoryId]: '' }));
  };

  const handleRemoveSkill = (categoryId: string, skillIndex: number) => {
    const category = profile?.skills.find((c) => c.id === categoryId);
    if (!category) return;

    updateSkillCategory(categoryId, {
      skills: category.skills.filter((_, i) => i !== skillIndex),
    });
  };

  const handleNext = () => {
    completeOnboardingStep('skills');
    router.push('/onboard/certifications');
  };

  const handleBack = () => {
    router.push('/onboard/education');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const defaultCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Tools & Platforms',
    'Soft Skills',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Organize your skills by category. These will be matched against job requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.skills.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Add skill categories to get started. Suggested categories:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {defaultCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addSkillCategory({ category: cat, skills: [] });
                    }}
                  >
                    + {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {profile.skills.map((category) => (
            <div key={category.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{category.category}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSkillCategory(category.id)}
                >
                  Remove
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {category.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(category.id, index)}
                      className="hover:text-destructive"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkills[category.id] || ''}
                  onChange={(e) =>
                    setNewSkills((prev) => ({
                      ...prev,
                      [category.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(category.id);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => handleAddSkill(category.id)}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button type="submit" variant="outline">
              + Add Category
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>Next: Certifications</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
