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
import type { Certification } from '@/types';
import { formatDate } from '@/lib/utils';

export default function CertificationsPage() {
  const router = useRouter();
  const {
    profile,
    setOnboardingStep,
    completeOnboardingStep,
    addCertification,
    updateCertification,
    deleteCertification,
  } = useProfileStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setOnboardingStep('certifications');
  }, [setOnboardingStep]);

  const handleAddCertification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const certification: Omit<Certification, 'id'> = {
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      dateObtained: formData.get('dateObtained') as string,
      expirationDate: formData.get('expirationDate') as string || undefined,
      credentialId: formData.get('credentialId') as string || undefined,
      credentialUrl: formData.get('credentialUrl') as string || undefined,
    };

    if (editingId) {
      updateCertification(editingId, certification);
      setEditingId(null);
    } else {
      addCertification(certification);
    }
    setIsAdding(false);
  };

  const handleNext = () => {
    completeOnboardingStep('certifications');
    router.push('/onboard/projects');
  };

  const handleBack = () => {
    router.push('/onboard/skills');
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Add any professional certifications you hold (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.certifications.length === 0 && !isAdding && (
            <p className="text-muted-foreground text-center py-8">
              No certifications added yet. This section is optional.
            </p>
          )}

          {profile.certifications.map((cert) => (
            <div
              key={cert.id}
              className="border rounded-lg p-4 mb-4 bg-muted/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer} - {formatDate(cert.dateObtained)}
                  </p>
                  {cert.credentialId && (
                    <p className="text-sm text-muted-foreground">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(cert.id);
                      setIsAdding(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCertification(cert.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {isAdding && (
            <form onSubmit={handleAddCertification} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Certification Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="AWS Solutions Architect"
                    defaultValue={
                      editingId
                        ? profile.certifications.find((c) => c.id === editingId)?.name
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization *</Label>
                  <Input
                    id="issuer"
                    name="issuer"
                    placeholder="Amazon Web Services"
                    defaultValue={
                      editingId
                        ? profile.certifications.find((c) => c.id === editingId)?.issuer
                        : ''
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateObtained">Date Obtained *</Label>
                  <Input
                    id="dateObtained"
                    name="dateObtained"
                    type="month"
                    defaultValue={
                      editingId
                        ? profile.certifications.find((c) => c.id === editingId)?.dateObtained
                        : ''
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="month"
                    defaultValue={
                      editingId
                        ? profile.certifications.find((c) => c.id === editingId)?.expirationDate
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credentialId">Credential ID</Label>
                  <Input
                    id="credentialId"
                    name="credentialId"
                    defaultValue={
                      editingId
                        ? profile.certifications.find((c) => c.id === editingId)?.credentialId
                        : ''
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credentialUrl">Credential URL</Label>
                  <Input
                    id="credentialUrl"
                    name="credentialUrl"
                    type="url"
                    defaultValue={
                      editingId
                        ? profile.certifications.find((c) => c.id === editingId)?.credentialUrl
                        : ''
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Add'} Certification
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
              + Add Certification
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>Next: Projects</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
