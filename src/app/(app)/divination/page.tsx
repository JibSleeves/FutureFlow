
"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useJournal } from '@/contexts/journal-context';
import type { GenerateInsightsInput, GenerateInsightsOutput } from '@/ai/flows/generate-insights';
import { handleGenerateInsightsAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function DivinationPageClient() {
  const [query, setQuery] = useState('');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addPrediction: addPredictionToJournal } = useJournal();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Please enter your question or topic of interest.");
      return;
    }
    setError(null);
    setPrediction(null);

    startTransition(async () => {
      const result = await handleGenerateInsightsAction({ query });
      if ('error' in result) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Divination Error",
          description: result.error,
        });
      } else {
        setPrediction(result.prediction);
      }
    });
  };

  const handleSaveToJournal = () => {
    if (prediction && query) {
      addPredictionToJournal({ 
        query, 
        predictionText: prediction,
        visualizationHint: "astrology mystical cosmic" 
      });
      toast({
        title: "Insight Saved",
        description: "Your prediction has been saved to your Future Journal.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Unveil Your Destiny</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Peer into the currents of fate with Divi-Bot. Ask your question, and let the cosmos reveal its secrets.
        </p>
      </header>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Seek Your Fortune</CardTitle>
          <CardDescription>Pose your query to the ethereal realm. What answers do you seek?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <Textarea
              placeholder="E.g., What does the coming month hold for my career?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="text-base bg-input/80 focus:bg-input"
              disabled={isPending}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
              {isPending ? <LoadingSpinner className="mr-2" /> : null}
              Divine My Future
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {prediction && (
        <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Your Future Unveiled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{prediction}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveToJournal} variant="outline" className="w-full">
              Save to Journal
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cosmic Echoes</CardTitle>
          <CardDescription>Visual currents reflecting the AI's interpretation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-border shadow-inner">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Astrological Visualization"
              width={600}
              height={400}
              className="object-cover w-full h-full"
              data-ai-hint="astrology mystical cosmic"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
