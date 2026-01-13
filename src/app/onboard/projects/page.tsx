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
import type { Project } from '@/types';

export default function ProjectsPage() {
  const router = useRouter();
  const {
    profile,
    setOnboardingStep,
    completeOnboarding,
    addProject,
    updateProject,
    deleteProject,
  } = useProfileStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setOnboardingStep('projects');
  }, [setOnboardingStep]);

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const project: Omit<Project, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      role: formData.get('role') as string || undefined,
      url: formData.get('url') as string || undefined,
      repoUrl: formData.get('repoUrl') as string || undefined,
      bullets: (formData.get('bullets') as string)
        .split('\n')
        .filter((b) => b.trim())
        .map((b) => b.trim()),
      technologies: (formData.get('technologies') as string)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingId) {
      updateProject(editingId, project);
      setEditingId(null);
    } else {
      addProject(project);
    }
    setIsAdding(false);
  };

  const handleFinish = () => {
    completeOnboarding();
    router.push('/dashboard');
  };

  const handleBack = () => {
    router.push('/onboard/certifications');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Add notable projects you&apos;ve worked on (optional but recommended)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.projects.length === 0 && !isAdding && (
            <p className="text-muted-foreground text-center py-8">
              No projects added yet. Projects can help showcase your skills.
            </p>
          )}

          {profile.projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 mb-4 bg-muted/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(project.id);
                      setIsAdding(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {isAdding && (
            <form onSubmit={handleAddProject} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={
                      editingId
                        ? profile.projects.find((p) => p.id === editingId)?.name
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="Lead Developer"
                    defaultValue={
                      editingId
                        ? profile.projects.find((p) => p.id === editingId)?.role
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={
                    editingId
                      ? profile.projects.find((p) => p.id === editingId)?.description
                      : ''
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Project URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    defaultValue={
                      editingId
                        ? profile.projects.find((p) => p.id === editingId)?.url
                        : ''
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repoUrl">Repository URL</Label>
                  <Input
                    id="repoUrl"
                    name="repoUrl"
                    type="url"
                    defaultValue={
                      editingId
                        ? profile.projects.find((p) => p.id === editingId)?.repoUrl
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bullets">Key Achievements (one per line)</Label>
                <Textarea
                  id="bullets"
                  name="bullets"
                  defaultValue={
                    editingId
                      ? profile.projects.find((p) => p.id === editingId)?.bullets.join('\n')
                      : ''
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  placeholder="React, TypeScript, Node.js"
                  defaultValue={
                    editingId
                      ? profile.projects.find((p) => p.id === editingId)?.technologies.join(', ')
                      : ''
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Add'} Project
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
              + Add Project
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
            Complete Setup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
