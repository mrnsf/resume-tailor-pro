'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { TailoringResult } from '@/types';

export default function ExportPage() {
  const router = useRouter();
  const [result, setResult] = useState<TailoringResult | null>(null);

  useEffect(() => {
    const resultJson = sessionStorage.getItem('tailoringResult');
    if (!resultJson) {
      router.push('/tailor');
      return;
    }
    setResult(JSON.parse(resultJson));
  }, [router]);

  const handleDownloadLatex = () => {
    if (!result) return;
    const blob = new Blob([result.generatedLatex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCoverLetter = () => {
    if (!result?.coverLetter) return;
    const blob = new Blob([result.coverLetter.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLatex = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.generatedLatex);
    alert('LaTeX copied to clipboard!');
  };

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Resume is Ready!</h1>
          <p className="text-muted-foreground">
            Download your tailored resume and cover letter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📄</span> Resume (LaTeX)
              </CardTitle>
              <CardDescription>
                Download the LaTeX source file to compile into a PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleDownloadLatex} className="w-full">
                Download .tex File
              </Button>
              <Button variant="outline" onClick={handleCopyLatex} className="w-full">
                Copy to Clipboard
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Compile at{' '}
                <a
                  href="https://www.overleaf.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Overleaf.com
                </a>{' '}
                or locally with pdflatex
              </p>
            </CardContent>
          </Card>

          {result.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>💼</span> Cover Letter
                </CardTitle>
                <CardDescription>
                  A personalized cover letter based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleDownloadCoverLetter} className="w-full">
                  Download Cover Letter
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (result.coverLetter) {
                      await navigator.clipboard.writeText(result.coverLetter.text);
                      alert('Cover letter copied!');
                    }
                  }}
                  className="w-full"
                >
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>LaTeX Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-[400px] overflow-y-auto">
              {result.generatedLatex}
            </pre>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/tailor">
            <Button variant="outline">Tailor Another Resume</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
