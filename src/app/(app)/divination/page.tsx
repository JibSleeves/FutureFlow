
"use client";

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For Chrono-Symbolic Moment
import { Label } from "@/components/ui/label"; // For Chrono-Symbolic Moment
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Added this line
import { useJournal } from '@/contexts/journal-context';
import type { GenerateInsightsInput, AstraKairosInsight } from '@/ai/flows/generate-insights';
import { handleGenerateInsightsAction, handleGetAstralWeatherAction, handleEvolveSymbolicSeedAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, Wand2, TestTube2, Layers3, Brain, BookHeart, Scroll, Telescope, Orbit, CalendarDays, Feather, Zap } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { handleSummarizePredictionsAction } from '../journal/actions'; 
import type { SummarizePredictionsInput } from '@/ai/flows/summarize-predictions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; 

const initialSymbolicSeeds = [
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

  const [currentSymbolicSeed, setCurrentSymbolicSeed] = useState<string>(() => initialSymbolicSeeds[Math.floor(Math.random() * initialSymbolicSeeds.length)]);
  const [chronoDate, setChronoDate] = useState<string>('');
  const [chronoFeeling, setChronoFeeling] = useState<string>('');
  const [astralWeather, setAstralWeather] = useState<string | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isEvolvingSeed, setIsEvolvingSeed] = useState(false);

  const fetchAstralWeather = useCallback(async () => {
    setIsWeatherLoading(true);
    try {
      const weatherResult = await handleGetAstralWeatherAction({ currentTimestamp: new Date().toISOString() });
      if (!('error' in weatherResult) && weatherResult.astralBriefing) {
        setAstralWeather(weatherResult.astralBriefing);
      } else if ('error' in weatherResult) {
        console.warn("Failed to get astral weather:", weatherResult.error);
        setAstralWeather("The astral currents are presently veiled.");
      }
    } catch (e) {
      console.warn("Exception fetching astral weather:", e);
      setAstralWeather("The astral currents are unusually quiet.");
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAstralWeather();
  }, [fetchAstralWeather]);

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Please enter your question or topic of interest for AstraKairos.");
      toast({ variant: "destructive", title: "Empty Query", description: "Pose your question to the ether." });
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
          .slice(0, 10) 
          .join('\n\n---\n\n');
        
        const summaryInput: SummarizePredictionsInput = { predictions: `Recent journal entries:\n${predictionsText}` };
        const summaryResult = await handleSummarizePredictionsAction(summaryInput);
        
        if (!('error' in summaryResult) && summaryResult.archetypalSummary) {
          journalHistorySummary = summaryResult.archetypalSummary;
        } else if ('error' in summaryResult) {
          console.warn("Failed to get archetypal summary:", summaryResult.error);
        }
      }

      const insightsInput: GenerateInsightsInput = { 
        query, 
        journalHistory: journalHistorySummary || undefined,
        symbolicSeed: currentSymbolicSeed,
        chronoSymbolicMomentDate: chronoDate || undefined,
        chronoSymbolicMomentFeeling: chronoFeeling || undefined,
      };
      const result = await handleGenerateInsightsAction(insightsInput);

      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "AstraKairos Divination Error", description: result.error });
      } else {
        setPrediction(result);
        toast({ title: "AstraKairos Has Spoken", description: "Your insights from the astral plane have arrived." });
      }
    });
  };

  const handleSaveToJournal = () => {
    if (prediction && query && prediction.journalSummaryForUser) {
      addPredictionToJournal({ 
        query, 
        predictionText: prediction.journalSummaryForUser,
        visualizationHint: prediction.emergentArchetypeVisualizationSeed, // Save new seed too
        symbolicSeedUsed: currentSymbolicSeed, // Save the seed used for this reading
        chronoSymbolicMomentDate: chronoDate || undefined,
        chronoSymbolicMomentFeeling: chronoFeeling || undefined,
      });
      toast({ title: "Insight Recorded", description: "AstraKairos's wisdom has been etched into your Future Journal." });
    } else {
       toast({ variant: "destructive", title: "Cannot Save", description: "No insight available to save or summary missing." });
    }
  };

  const handleEvolveSeed = async () => {
    if (!prediction || !prediction.journalSummaryForUser) {
      toast({ variant: "destructive", title: "Cannot Evolve Seed", description: "A divination result is needed to evolve its seed." });
      return;
    }
    setIsEvolvingSeed(true);
    try {
      const result = await handleEvolveSymbolicSeedAction({
        currentSeed: currentSymbolicSeed,
        lastReadingSummary: prediction.journalSummaryForUser,
      });
      if (!('error' in result) && result.evolvedSeed) {
        setCurrentSymbolicSeed(result.evolvedSeed);
        toast({ title: "Symbolic Seed Evolved", description: `New seed: "${result.evolvedSeed}". It will be used for your next divination.` });
      } else if ('error' in result) {
        toast({ variant: "destructive", title: "Seed Evolution Failed", description: result.error });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Seed Evolution Error", description: e.message || "Unknown error." });
    } finally {
      setIsEvolvingSeed(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-accent" /> AstraKairos Divination
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Peer into the currents of fate with AstraKairos, your advanced AI Oracle.
        </p>
      </header>

      <Card className="shadow-md bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Telescope className="h-5 w-5 text-accent" />Astral Weather Briefing</CardTitle>
        </CardHeader>
        <CardContent>
          {isWeatherLoading ? <LoadingSpinner size="sm"/> : <p className="text-muted-foreground italic">{astralWeather}</p>}
        </CardContent>
      </Card>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Seek Your Fortune</CardTitle>
          <CardDescription>Pose your query to the ethereal realm. Current Symbolic Seed: <span className="text-accent italic">"{currentSymbolicSeed}"</span></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div>
              <Label htmlFor="user-query" className="text-base">Your Query</Label>
              <Textarea
                id="user-query"
                placeholder="E.g., What does the coming month hold for my career path?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                className="text-base bg-input/80 focus:bg-input mt-1"
                disabled={isPending}
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="chrono-symbolic-moment">
                <AccordionTrigger className="text-base hover:no-underline">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary/80" />
                    Optional: Anchor with a Chrono-Symbolic Moment
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="chrono-date">Significant Date/Time (Past or Future)</Label>
                    <Input
                      id="chrono-date"
                      type="datetime-local"
                      value={chronoDate}
                      onChange={(e) => setChronoDate(e.target.value)}
                      className="bg-input/80 focus:bg-input mt-1"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="chrono-feeling">Abstract Temporal Feeling</Label>
                    <Input
                      id="chrono-feeling"
                      placeholder="E.g., 'The edge of change', 'A quiet ending'"
                      value={chronoFeeling}
                      onChange={(e) => setChronoFeeling(e.target.value)}
                      className="bg-input/80 focus:bg-input mt-1"
                      disabled={isPending}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
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

          <SectionCard title="Astrological Insight" icon={<Orbit className="h-5 w-5 text-accent" />} description="Echoes from the celestial spheres, anchored in this moment.">
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
                <CardDescription>Record the essence of this divination for future reflection. This will include the visualization seed: <span className="italic text-accent">{prediction.emergentArchetypeVisualizationSeed}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <p className="italic text-muted-foreground whitespace-pre-wrap">{prediction.journalSummaryForUser}</p>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-2">
              <Button onClick={handleSaveToJournal} variant="outline" className="w-full sm:flex-1 bg-primary/10 hover:bg-primary/20">
                Save Insight to Future Journal
              </Button>
              <Button 
                onClick={handleEvolveSeed} 
                variant="outline" 
                className="w-full sm:flex-1" 
                disabled={isEvolvingSeed || isPending}
              >
                {isEvolvingSeed ? <LoadingSpinner className="mr-2" size="sm"/> : <Feather className="mr-2 h-4 w-4" />}
                Evolve Symbolic Seed
              </Button>
            </CardFooter>
          </Card>
           <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Cosmic Visualization Seed</CardTitle>
              <CardDescription>AstraKairos has crafted an archetypal seed phrase for visual contemplation or future AI image generation: "<span className="italic text-accent">{prediction.emergentArchetypeVisualizationSeed}</span>". This hint is embedded in the placeholder below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-border shadow-inner bg-background/50 flex items-center justify-center relative">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Astrological Visualization Placeholder"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full opacity-70"
                  data-ai-hint={prediction.emergentArchetypeVisualizationSeed} // Dynamically set hint
                />
                <Zap className="absolute h-16 w-16 text-accent/70 animate-pulse" /> 
              </div>
            </CardContent>
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
    </div>
  );
}
