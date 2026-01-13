'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfileStore } from '@/store/profile-store';
import { tailorResume } from '@/lib/tailoring-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TailorSettings, TailoringResult, TailorChange } from '@/types';

type ProcessingStage =
  | 'extracting'
  | 'analyzing'
  | 'generating'
  | 'complete'
  | 'error';

export default function ReviewPage() {
  const router = useRouter();
  const { profile } = useProfileStore();

  const [stage, setStage] = useState<ProcessingStage>('extracting');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<TailoringResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');

  useEffect(() => {
    const runTailoring = async () => {
      const jobDescription = sessionStorage.getItem('tailorJobDescription');
      const settingsJson = sessionStorage.getItem('tailorSettings');

      if (!jobDescription || !settingsJson || !profile) {
        router.push('/tailor');
        return;
      }

      const settings: TailorSettings = JSON.parse(settingsJson);

      try {
        setStage('extracting');
        setProgress(20);

        // Small delay for UX
        await new Promise((r) => setTimeout(r, 500));
        setStage('analyzing');
        setProgress(50);

        await new Promise((r) => setTimeout(r, 500));
        setStage('generating');
        setProgress(80);

        const tailoringResult = await tailorResume(profile, jobDescription, settings);

        setProgress(100);
        setStage('complete');
        setResult(tailoringResult);
      } catch (err) {
        console.error('Tailoring error:', err);
        setStage('error');
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    runTailoring();
  }, [profile, router]);

  const handleChangeStatus = (changeId: string, status: TailorChange['status']) => {
    if (!result) return;
    setResult({
      ...result,
      changes: result.changes.map((c) =>
        c.id === changeId ? { ...c, status } : c
      ),
    });
  };

  const handleAcceptAllLowRisk = () => {
    if (!result) return;
    setResult({
      ...result,
      changes: result.changes.map((c) =>
        c.riskLevel === 'low' && c.status === 'pending'
          ? { ...c, status: 'accepted' }
          : c
      ),
    });
  };

  const handleExport = () => {
    if (!result) return;
    sessionStorage.setItem('tailoringResult', JSON.stringify(result));
    router.push('/tailor/export');
  };

  // Processing view
  if (stage !== 'complete' && stage !== 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-semibold">Tailoring Your Resume</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    stage === 'extracting'
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {stage === 'extracting' ? '...' : '1'}
                </div>
                <span>Reading job requirements</span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    stage === 'analyzing'
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : stage === 'extracting'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {stage === 'analyzing' ? '...' : '2'}
                </div>
                <span>Mapping to your experience</span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    stage === 'generating'
                      ? 'bg-primary text-primary-foreground animate-pulse'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stage === 'generating' ? '...' : '3'}
                </div>
                <span>Generating tailored content</span>
              </div>
            </div>

            <Progress value={progress} className="mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error view
  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center text-destructive text-2xl">
              !
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Link href="/tailor">
                <Button variant="outline">Try Again</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  // Review view
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Review Changes</h1>
            <p className="text-muted-foreground">
              Review and approve the suggested changes to your resume
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tailor">
              <Button variant="outline">Start Over</Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'resume' ? 'default' : 'outline'}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </Button>
          {result.coverLetter && (
            <Button
              variant={activeTab === 'coverLetter' ? 'default' : 'outline'}
              onClick={() => setActiveTab('coverLetter')}
            >
              Cover Letter
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Changes */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Changes ({result.changes.length})
                  </CardTitle>
                  <Button size="sm" onClick={handleAcceptAllLowRisk}>
                    Accept All Low-Risk
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {result.changes.map((change) => (
                  <div
                    key={change.id}
                    className={`border rounded-lg p-3 ${
                      change.status === 'accepted'
                        ? 'border-green-500 bg-green-50'
                        : change.status === 'rejected'
                        ? 'border-red-500 bg-red-50 opacity-50'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          {change.section}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            change.riskLevel === 'low'
                              ? 'bg-green-100 text-green-700'
                              : change.riskLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {change.riskLevel} risk
                        </span>
                      </div>
                      <span className="text-xs capitalize text-muted-foreground">
                        {change.changeType}
                      </span>
                    </div>

                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-muted-foreground">Before: </span>
                        <span className="line-through">{change.originalText}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">After: </span>
                        <span className="font-medium">{change.suggestedText}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {change.reason}
                      </div>
                    </div>

                    {change.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleChangeStatus(change.id, 'accepted')}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeStatus(change.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Keyword Coverage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Keyword Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-green-600 mb-1">
                      Present ({result.keywordCoverage.present.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {result.keywordCoverage.present.map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-yellow-600 mb-1">
                      Implied ({result.keywordCoverage.implied.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {result.keywordCoverage.implied.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded"
                          title={item.evidence}
                        >
                          {item.keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-1">
                      Missing ({result.keywordCoverage.missing.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {result.keywordCoverage.missing.map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Preview */}
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {activeTab === 'resume' ? 'LaTeX Preview' : 'Cover Letter'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === 'resume' ? (
                  <Textarea
                    value={result.generatedLatex}
                    readOnly
                    className="font-mono text-xs min-h-[600px]"
                  />
                ) : result.coverLetter ? (
                  <div className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      {result.coverLetter.text.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Claims & Evidence</h4>
                      <div className="space-y-2 text-sm">
                        {result.coverLetter.claims.map((claim, i) => (
                          <div key={i} className="bg-muted p-2 rounded">
                            <p className="font-medium">{claim.claim}</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              Evidence: {claim.evidence}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" onClick={handleExport}>
            Generate Final Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
