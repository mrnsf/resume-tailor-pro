'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/store/profile-store';

export default function Home() {
  const router = useRouter();
  const { isOnboarded, initializeProfile } = useProfileStore();

  useEffect(() => {
    initializeProfile();

    // Redirect based on onboarding status
    if (isOnboarded) {
      router.push('/dashboard');
    } else {
      router.push('/onboard');
    }
  }, [isOnboarded, router, initializeProfile]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Resume Tailor Pro</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </main>
  );
}
