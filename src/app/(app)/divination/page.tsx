
"use client";

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useJournal } from '@/contexts/journal-context';
import type { GenerateInsightsInput, AstraKairosInsight } from '@/ai/flows/generate-insights';
import { handleGenerateInsightsAction, handleGetAstralWeatherAction, handleEvolveSymbolicSeedAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Wand2, TestTube2, Layers3, Brain, BookHeart, Scroll, Telescope, Orbit, CalendarDays, Feather, Zap, Eye, Tags, Sigma, HandCoins } from "lucide-react"; // Replaced CrystalBall with Sparkles
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { handleSummarizePredictionsAction } from '../journal/actions'; 
import type { SummarizePredictionsInput } from '@/ai/flows/summarize-predictions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; 
import { Badge } from '@/components/ui/badge';

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
  <Card className={cn("shadow-xl bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-lg overflow-hidden", className)}>
    <CardHeader className="bg-secondary/30 p-4 border-b border-primary/20">
      <CardTitle className="text-xl flex items-center gap-2 text-primary font-serif">
        {icon || <Sparkles className="h-5 w-5" />}
        {title}
      </CardTitle>
      {description && <CardDescription className="text-muted-foreground italic text-sm">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="text-base leading-relaxed whitespace-pre-wrap p-4 text-foreground/90">
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

  const [currentSymbolicSeed, setCurrentSymbolicSeed] = useState<string | null>(null);
  const [chronoDate, setChronoDate] = useState<string>('');
  const [chronoFeeling, setChronoFeeling] = useState<string>('');
  const [astralWeather, setAstralWeather] = useState<string | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isEvolvingSeed, setIsEvolvingSeed] = useState(false);

  useEffect(() => {
    setCurrentSymbolicSeed(initialSymbolicSeeds[Math.floor(Math.random() * initialSymbolicSeeds.length)]);
  }, []);

  const fetchAstralWeather = useCallback(async () => {
    setIsWeatherLoading(true);
    try {
      const weatherResult = await handleGetAstralWeatherAction({ currentTimestamp: new Date().toISOString() });
      if (!('error' in weatherResult) && weatherResult.astralBriefing) {
        setAstralWeather(weatherResult.astralBriefing);
      } else if ('error' in weatherResult) {
        console.warn("Failed to get astral weather:", weatherResult.error);
        setAstralWeather("The astral currents are presently veiled by a velvet curtain.");
      }
    } catch (e) {
      console.warn("Exception fetching astral weather:", e);
      setAstralWeather("The astral currents are unusually quiet, as if holding their breath.");
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAstralWeather();
  }, [fetchAstralWeather]);

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Whisper your query into the æther, seeker.");
      toast({ variant: "destructive", title: "Empty Query", description: "Pose your question to the Oracle." });
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
        
        const summaryInput: SummarizePredictionsInput = { predictions: `Recent chronicles of fate:\n${predictionsText}` };
        const summaryResult = await handleSummarizePredictionsAction(summaryInput);
        
        if (!('error' in summaryResult) && summaryResult.archetypalSummary) {
          journalHistorySummary = summaryResult.archetypalSummary;
        } else if ('error' in summaryResult) {
          console.warn("Failed to distill archetypal summary:", summaryResult.error);
        }
      }

      const insightsInput: GenerateInsightsInput = { 
        query, 
        journalHistory: journalHistorySummary || undefined,
        symbolicSeed: currentSymbolicSeed || undefined,
        chronoSymbolicMomentDate: chronoDate || undefined,
        chronoSymbolicMomentFeeling: chronoFeeling || undefined,
      };
      const result = await handleGenerateInsightsAction(insightsInput);

      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "AstraKairos Stumbles", description: result.error });
      } else {
        setPrediction(result);
        toast({ title: "The Oracle Has Spoken!", description: "Your glimpse into the æther has arrived.", className:"bg-primary/10 border-primary text-primary-foreground" });
      }
    });
  };

  const handleSaveToJournal = () => {
    if (prediction && query && prediction.journalSummaryForUser) {
      addPredictionToJournal({ 
        query, 
        predictionText: prediction.journalSummaryForUser,
        visualizationHint: prediction.emergentArchetypeVisualizationSeed,
        symbolicSeedUsed: currentSymbolicSeed || undefined,
        chronoSymbolicMomentDate: chronoDate || undefined,
        chronoSymbolicMomentFeeling: chronoFeeling || undefined,
      });
      toast({ title: "Wisdom Chronicled", description: "AstraKairos's words are etched in the Oracle's Chronicle.", className: "bg-primary/10 border-primary text-primary-foreground" });
    } else {
       toast({ variant: "destructive", title: "Cannot Chronicle", description: "No vision to record, or the Oracle's summary is missing." });
    }
  };

  const handleEvolveSeed = async () => {
    if (!currentSymbolicSeed || !prediction || !prediction.journalSummaryForUser) {
      toast({ variant: "destructive", title: "Seed Unchanged", description: "A vision and an active symbolic seed are needed to weave anew." });
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
        toast({ title: "Symbolic Seed Transformed!", description: `New seed: "${result.evolvedSeed}". It shall guide your next seeking.`, className:"bg-primary/10 border-primary text-primary-foreground"});
      } else if ('error' in result) {
        toast({ variant: "destructive", title: "Seed Transformation Failed", description: result.error });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Seed Transformation Error", description: e.message || "An unseen force interfered." });
    } finally {
      setIsEvolvingSeed(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16">
      <header className="text-center py-6">
        <h1 className="text-5xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-3 mb-2">
          <Sparkles className="h-12 w-12 text-accent fortune-teller-glow" /> AstraKairos
        </h1>
        <p className="mt-2 text-xl text-muted-foreground font-serif italic">
          The All-Seeing Eye Peers into the Mists of Time...
        </p>
      </header>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/40 p-4 border-b-2 border-primary/30">
          <CardTitle className="text-lg flex items-center gap-2 text-primary font-serif"><Telescope className="h-6 w-6 text-accent animate-pulse" />Astral Weather Vane</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isWeatherLoading ? <LoadingSpinner size="sm" className="text-accent"/> : <p className="text-muted-foreground italic text-center text-lg">{astralWeather}</p>}
        </CardContent>
      </Card>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
          <CardTitle className="text-2xl font-serif text-primary">Offer Your Query</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            The currents of fate stir. Current Symbolic Seed:{" "}
            {currentSymbolicSeed ? (
              <span className="text-accent font-semibold">"{currentSymbolicSeed}"</span>
            ) : (
              <span className="text-muted-foreground">Awaiting inspiration...</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div>
              <Label htmlFor="user-query" className="text-lg font-serif text-primary/90 flex items-center gap-2"><HandCoins className="h-5 w-5 text-accent"/>Your Question for the Oracle:</Label>
              <Textarea
                id="user-query"
                placeholder="E.g., What destiny awaits my heart's desire?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                className="text-lg bg-input/80 focus:bg-input mt-2 p-3 rounded-md border-2 border-primary/20 focus:border-accent shadow-inner"
                disabled={isPending}
              />
            </div>

            <Accordion type="single" collapsible className="w-full border-t-2 border-b-2 border-primary/20 rounded-md overflow-hidden">
              <AccordionItem value="chrono-symbolic-moment" className="border-none">
                <AccordionTrigger className="text-md font-serif hover:no-underline text-primary/80 hover:bg-primary/10 p-3 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-accent/80" />
                    Optional: Anchor with a Moment of Power
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 bg-background/30">
                  <div>
                    <Label htmlFor="chrono-date" className="font-serif text-primary/80">Significant Date/Time (Past or Future)</Label>
                    <Input
                      id="chrono-date"
                      type="datetime-local"
                      value={chronoDate}
                      onChange={(e) => setChronoDate(e.target.value)}
                      className="bg-input/80 focus:bg-input mt-1 p-2 rounded-md border-primary/20 focus:border-accent shadow-inner"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="chrono-feeling" className="font-serif text-primary/80">Abstract Temporal Feeling</Label>
                    <Input
                      id="chrono-feeling"
                      placeholder="E.g., 'The hush before the dawn', 'An echo of joyous laughter'"
                      value={chronoFeeling}
                      onChange={(e) => setChronoFeeling(e.target.value)}
                      className="bg-input/80 focus:bg-input mt-1 p-2 rounded-md border-primary/20 focus:border-accent shadow-inner"
                      disabled={isPending}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-serif" disabled={isPending}>
              {isPending ? <LoadingSpinner className="mr-2" /> : <Wand2 className="mr-2 h-6 w-6" />}
              Consult AstraKairos
            </Button>
          </form>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <LoadingSpinner size="lg" className="text-accent" />
          <p className="text-xl text-primary animate-pulse font-serif">AstraKairos consults the swirling mists of fate...</p>
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-md border-2 border-destructive/50 rounded-lg bg-destructive/10">
          <Sparkles className="h-5 w-5 text-destructive" /> {/* Replaced CrystalBall */}
          <AlertTitle className="font-serif text-lg">The Vision Clouded...</AlertTitle>
          <AlertDescription className="font-serif">{error}</AlertDescription>
        </Alert>
      )}

      {prediction && !isPending && (
        <div className="space-y-6">
          <SectionCard title="Mystic Prelude" icon={<Sparkles className="h-6 w-6 text-accent animate-pulse" />}>
            <p className="italic text-lg">{prediction.mysticPrelude}</p>
          </SectionCard>

          <SectionCard title="Celestial Harmonies" icon={<Orbit className="h-6 w-6 text-accent animate-pulse" />} description="Echoes from the starry spheres, woven into this moment.">
            {prediction.astrologyInsight}
          </SectionCard>

          <SectionCard title="Alchemist's Transmutation" icon={<TestTube2 className="h-6 w-6 text-accent animate-pulse" />} description="Transformative processes mirrored in the soul's crucible.">
            {prediction.alchemicalReflection}
          </SectionCard>

          <SectionCard title="Oracle's Spread" icon={<Layers3 className="h-6 w-6 text-accent animate-pulse" />} description={prediction.divinationSpread.introduction}>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold font-serif text-lg text-primary/90">Past Influence: {prediction.divinationSpread.past.card}</h4>
                <p>{prediction.divinationSpread.past.interpretation}</p>
              </div>
              <Separator className="my-3 bg-border/30"/>
              <div>
                <h4 className="font-semibold font-serif text-lg text-primary/90">Present Focus: {prediction.divinationSpread.present.card}</h4>
                <p>{prediction.divinationSpread.present.interpretation}</p>
              </div>
              <Separator className="my-3 bg-border/30"/>
              <div>
                <h4 className="font-semibold font-serif text-lg text-primary/90">Future's Whisper: {prediction.divinationSpread.futurePotential.card}</h4>
                <p>{prediction.divinationSpread.futurePotential.interpretation}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Psionic Echo & Clairvoyant Glimpse" icon={<Brain className="h-6 w-6 text-accent animate-pulse" />} description="Whispers from the subtle tapestry of probability.">
            <p className="italic">{prediction.psionicClairvoyantFlash.description}</p>
            {prediction.psionicClairvoyantFlash.imageryTags && prediction.psionicClairvoyantFlash.imageryTags.length > 0 && (
              <div className="mt-3">
                <h5 className="text-sm font-semibold font-serif text-primary/80 mb-1 flex items-center gap-1"><Tags className="h-4 w-4"/>Symbolic Tags:</h5>
                <div className="flex flex-wrap gap-2">
                  {prediction.psionicClairvoyantFlash.imageryTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-primary/20 text-primary-foreground/80 border border-primary/30 shadow-sm">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
          
          <SectionCard title="Observed Symbolic Signatures" icon={<Eye className="h-6 w-6 text-accent animate-pulse" />} description="Key patterns and energies noted by AstraKairos.">
            <p>{prediction.observedSymbolicSignatures}</p>
          </SectionCard>
          
          <SectionCard title="Mystic Counsel" icon={<BookHeart className="h-6 w-6 text-accent animate-pulse" />} description="Steps to align with the revealed currents.">
            {prediction.mysticGuidance}
          </SectionCard>

          <SectionCard title="AstraKairos's Parting Word" icon={<Sparkles className="h-6 w-6 text-accent animate-pulse" />}>
             <p className="italic text-lg">{prediction.finalWord}</p>
          </SectionCard>
          
          <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
            <CardHeader className="bg-secondary/40 p-4 border-b-2 border-primary/30">
                <CardTitle className="text-xl flex items-center gap-2 font-serif text-primary">
                    <Scroll className="h-6 w-6 text-accent"/>Scribe this Vision
                </CardTitle>
                <CardDescription className="font-serif italic text-muted-foreground">Record the essence of this divination for future reflection. This will include the visualization seed: <span className="font-semibold text-accent">{prediction.emergentArchetypeVisualizationSeed}</span></CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <p className="italic text-muted-foreground whitespace-pre-wrap text-md">{prediction.journalSummaryForUser}</p>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-3 p-4">
              <Button onClick={handleSaveToJournal} variant="outline" className="w-full sm:flex-1 bg-primary/20 hover:bg-primary/30 border-primary/50 text-primary-foreground hover:text-foreground font-serif text-md py-3 rounded-md shadow-md hover:shadow-lg transition-all">
                Save to Oracle's Chronicle
              </Button>
              <Button 
                onClick={handleEvolveSeed} 
                variant="outline" 
                className="w-full sm:flex-1 border-accent/70 text-accent hover:bg-accent/20 font-serif text-md py-3 rounded-md shadow-md hover:shadow-lg transition-all" 
                disabled={isEvolvingSeed || isPending || !currentSymbolicSeed || !prediction?.journalSummaryForUser}
              >
                {isEvolvingSeed ? <LoadingSpinner className="mr-2" size="sm"/> : <Feather className="mr-2 h-5 w-5" />}
                Evolve Symbolic Seed
              </Button>
            </CardFooter>
          </Card>
           <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
            <CardHeader className="bg-secondary/40 p-4 border-b-2 border-primary/30">
              <CardTitle className="text-xl font-serif text-primary">Cosmic Visualization Seed</CardTitle>
              <CardDescription className="font-serif italic text-muted-foreground">AstraKairos has crafted an archetypal seed phrase for visual contemplation: "<span className="font-semibold text-accent">{prediction.emergentArchetypeVisualizationSeed}</span>". This hint is embedded in the placeholder below, should you wish to conjure its form.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg border-2 border-primary/20 shadow-inner bg-background/50 flex items-center justify-center relative">
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Cosmic Visualization Placeholder"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full opacity-50"
                  data-ai-hint={`mystical ${prediction.emergentArchetypeVisualizationSeed} antique`}
                />
                <Zap className="absolute h-20 w-20 text-accent/60 fortune-teller-glow opacity-70" /> 
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Card className="shadow-xl bg-card/50 backdrop-blur-sm mt-10 border-2 border-primary/20 rounded-lg">
        <CardHeader className="bg-secondary/30 p-4 border-b border-primary/20">
          <CardTitle className="text-lg font-serif text-primary">AstraKairos Caveats</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2 p-4 font-serif">
          <p>Visions unveiled by AstraKairos are woven from the threads of artificial intuition, interpreting symbolic systems and archetypal echoes. They are offered for personal contemplation, inspiration, and amusement.</p>
          <p>These divinations are but reflections in a digital scrying glass, not substitutes for professional counsel. For matters of health, law, finance, or mind, seek guidance from qualified mortals.</p>
          <p>AstraKairos operates within the currents of symbolic interpretation and does not claim true prescience, nor does it retain personal data beyond the immediate context of your queries and the chronicles you choose to keep within this application.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    