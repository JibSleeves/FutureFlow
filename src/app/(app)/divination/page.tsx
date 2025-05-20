
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useJournal } from '@/contexts/journal-context';
import type { GenerateInsightsInput, AstraKairosInsight } from '@/ai/flows/generate-insights';
import { handleGenerateInsightsAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Wand2, TestTube2, Layers3, Brain, BookHeart, Scroll } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { handleSummarizePredictionsAction } from '../journal/actions'; // Adjusted path
import type { SummarizePredictionsInput } from '@/ai/flows/summarize-predictions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; 

const symbolicSeeds = [
  "a raven feather on snow",
  "a forgotten melody",
  "the scent of ozone before a storm",
  "a spiral staircase descending into mist",
  "a single, unblinking eye in the clouds",
  "a cracked hourglass, sand still flowing",
  "a doorway shimmering with unseen light",
  "the echo of distant chimes",
  "a map with uncharted territories",
  "a silver key turning in an invisible lock",
  "the rustle of unseen wings",
  "a constellation that appears only once a century",
  "a reflection in water showing a different sky",
  "footprints leading into a wall of fog",
  "a book whose pages turn themselves",
];

const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; description?: string; className?: string }> = ({ title, icon, children, description, className }) => (
  <Card className={cn("shadow-lg bg-card/70 backdrop-blur-sm", className)}>
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-2 text-primary">
        {icon || <Sparkles className="h-5 w-5" />}
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="text-base leading-relaxed whitespace-pre-wrap">
      {children}
    </CardContent>
  </Card>
);

export default function DivinationPageClient() {
  const [query, setQuery] = useState('');
  const [prediction, setPrediction] = useState<AstraKairosInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { addPrediction: addPredictionToJournal, getPredictions } = useJournal();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Please enter your question or topic of interest for AstraKairos.");
      toast({
        variant: "destructive",
        title: "Empty Query",
        description: "Pose your question to the ether.",
      });
      return;
    }
    setError(null);
    setPrediction(null);

    startTransition(async () => {
      let journalHistorySummary = "";
      const pastPredictions = getPredictions();
      if (pastPredictions.length > 0) {
        const predictionsText = pastPredictions
          .map(p => `On ${format(new Date(p.date), 'PPP')}, Query: "${p.query}", AstraKairos Said: "${p.prediction}"`)
          .slice(0, 10) // Consider more entries for better summary
          .join('\n\n---\n\n');
        
        const summaryInput: SummarizePredictionsInput = { predictions: `Recent journal entries:\n${predictionsText}` };
        const summaryResult = await handleSummarizePredictionsAction(summaryInput);
        
        if (!('error' in summaryResult) && summaryResult.archetypalSummary) {
          journalHistorySummary = summaryResult.archetypalSummary;
        } else if ('error' in summaryResult) {
          console.warn("Failed to get archetypal summary:", summaryResult.error);
          // Proceed without summary if it fails, or handle error more gracefully
        }
      }

      const randomSeed = symbolicSeeds[Math.floor(Math.random() * symbolicSeeds.length)];

      const insightsInput: GenerateInsightsInput = { 
        query, 
        journalHistory: journalHistorySummary || undefined, // Ensure undefined if empty
        symbolicSeed: randomSeed 
      };
      const result = await handleGenerateInsightsAction(insightsInput);

      if ('error' in result) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "AstraKairos Divination Error",
          description: result.error,
        });
      } else {
        setPrediction(result);
        toast({
          title: "AstraKairos Has Spoken",
          description: "Your insights from the astral plane have arrived.",
        });
      }
    });
  };

  const handleSaveToJournal = () => {
    if (prediction && query && prediction.journalSummaryForUser) {
      addPredictionToJournal({ 
        query, 
        predictionText: prediction.journalSummaryForUser,
        visualizationHint: "astral cosmic symbols"
      });
      toast({
        title: "Insight Recorded",
        description: "AstraKairos's wisdom has been etched into your Future Journal.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Cannot Save",
        description: "No insight available to save or summary missing.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-accent" /> AstraKairos Divination
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Peer into the currents of fate with AstraKairos, your advanced AI Oracle. Ask your question, and let the cosmos reveal its secrets.
        </p>
      </header>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Seek Your Fortune</CardTitle>
          <CardDescription>Pose your query to the ethereal realm. What answers do you seek from AstraKairos?</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
            <Textarea
              placeholder="E.g., What does the coming month hold for my career path?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="text-base bg-input/80 focus:bg-input"
              disabled={isPending}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6" disabled={isPending}>
              {isPending ? <LoadingSpinner className="mr-2" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Divine My Future with AstraKairos
            </Button>
          </form>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-primary animate-pulse">AstraKairos is consulting the cosmic currents...</p>
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>An Error Occurred With AstraKairos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {prediction && !isPending && (
        <div className="space-y-6">
          <SectionCard title="Mystic Prelude" icon={<Sparkles className="h-5 w-5 text-accent" />}>
            <p className="italic">{prediction.mysticPrelude}</p>
          </SectionCard>

          <SectionCard title="Astrological Insight" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-orbit"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="22" x2="12" y2="18"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="2" y1="12" x2="6" y2="12"/></svg>} description="Echoes from the celestial spheres, anchored in this moment.">
            {prediction.astrologyInsight}
          </SectionCard>

          <SectionCard title="Alchemical Reflection" icon={<TestTube2 className="h-5 w-5 text-accent" />} description="Transformative processes mirrored in the soul's laboratory.">
            {prediction.alchemicalReflection}
          </SectionCard>

          <SectionCard title="Divination Spread" icon={<Layers3 className="h-5 w-5 text-accent" />} description={prediction.divinationSpread.introduction}>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-primary/90">Past: {prediction.divinationSpread.past.card}</h4>
                <p>{prediction.divinationSpread.past.interpretation}</p>
              </div>
              <Separator className="my-2 bg-border/50"/>
              <div>
                <h4 className="font-semibold text-primary/90">Present: {prediction.divinationSpread.present.card}</h4>
                <p>{prediction.divinationSpread.present.interpretation}</p>
              </div>
              <Separator className="my-2 bg-border/50"/>
              <div>
                <h4 className="font-semibold text-primary/90">Potential Future: {prediction.divinationSpread.futurePotential.card}</h4>
                <p>{prediction.divinationSpread.futurePotential.interpretation}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Psionic & Clairvoyant Flash" icon={<Brain className="h-5 w-5 text-accent" />} description="Whispers from the subtle realms of probability.">
            <p className="italic">{prediction.psionicClairvoyantFlash}</p>
          </SectionCard>
          
          <SectionCard title="Mystic Guidance" icon={<BookHeart className="h-5 w-5 text-accent" />} description="Steps to align with the revealed currents.">
            {prediction.mysticGuidance}
          </SectionCard>

          <SectionCard title="AstraKairos's Final Word" icon={<Sparkles className="h-5 w-5 text-accent" />}>
             <p className="italic">{prediction.finalWord}</p>
          </SectionCard>
          
          <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Scroll className="h-5 w-5 text-primary"/>Save to Journal
                </CardTitle>
                <CardDescription>Record the essence of this divination for future reflection.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="italic text-muted-foreground whitespace-pre-wrap">{prediction.journalSummaryForUser}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveToJournal} variant="outline" className="w-full bg-primary/10 hover:bg-primary/20">
                Save Insight to Future Journal
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <Card className="shadow-xl bg-card/50 backdrop-blur-sm mt-10">
        <CardHeader>
          <CardTitle className="text-lg">AstraKairos Disclaimers</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Insights provided by AstraKairos are generated through AI interpreting symbolic systems and archetypal patterns. They are intended for personal reflection, inspiration, and entertainment purposes only.</p>
          <p>These divinations are not substitutes for professional advice. Please consult with qualified professionals for any medical, legal, financial, or psychological concerns.</p>
          <p>AstraKairos operates on symbolic interpretation and does not access or store personal data beyond the immediate context of your queries and voluntarily journaled entries within this application.</p>
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cosmic Visualization</CardTitle>
          <CardDescription>Visual currents reflecting AstraKairos's interpretation (conceptual).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-border shadow-inner bg-background/50 flex items-center justify-center">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Astrological Visualization Placeholder"
              width={600}
              height={400}
              className="object-cover w-full h-full opacity-70"
              data-ai-hint="astrology galaxy stars"
            />
             <Sparkles className="absolute h-24 w-24 text-accent opacity-50 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

