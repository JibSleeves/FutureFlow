
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
import { handleGenerateInsightsAction, handleGetAstralWeatherAction, handleEvolveSymbolicSeedAction, handleGetDailySymbolicFocusAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sparkles, Wand2, TestTube2, Layers3, Brain, BookHeart, Scroll, Telescope, Orbit, CalendarDays, Feather, Zap, Eye, Tags, Sigma, HandCoins, Palette, SunMoon, Hourglass } from "lucide-react"; 
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { handleSummarizePredictionsAction } from '../journal/actions'; 
import type { SummarizePredictionsInput } from '@/ai/flows/summarize-predictions';
import type { Prediction } from '@/types';
import { format, formatISO } from 'date-fns';
import { cn } from '@/lib/utils'; 
import { Badge } from '@/components/ui/badge';

const initialSymbolicSeeds = [
  "a raven feather on snow", "a forgotten melody", "the scent of ozone before a storm",
  "a spiral staircase into mist", "an unblinking eye in the clouds", "a cracked hourglass, sand still flowing",
  "a doorway shimmering with unseen light", "the echo of distant chimes", "a map with uncharted territories",
  "a silver key in an invisible lock", "the rustle of unseen wings", "a constellation seen once a century",
  "a reflection showing a different sky", "footprints into fog", "a self-turning book", "whispers from a hollow tree", "a compass pointing inwards"
];

const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; description?: string; className?: string }> = ({ title, icon, children, description, className }) => (
  <Card className={cn("shadow-ornate bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-primary/30", className)}>
    <CardHeader className="bg-secondary/40 p-4 border-b-2 border-primary/30">
      <CardTitle className="text-xl flex items-center gap-2.5 text-primary font-lora tracking-wider">
        {icon || <Sparkles className="h-6 w-6 animate-pulse-glow" />}
        {title}
      </CardTitle>
      {description && <CardDescription className="text-muted-foreground italic text-sm font-serif">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="text-base leading-relaxed whitespace-pre-wrap p-5 text-foreground/90 font-serif">
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
  const [dailySymbolicFocus, setDailySymbolicFocus] = useState<string | null>(null);
  const [isDailyFocusLoading, setIsDailyFocusLoading] = useState(true);

  const [showTemporalEchoDialog, setShowTemporalEchoDialog] = useState(false);
  const [temporalEchoData, setTemporalEchoData] = useState<{ pastQuery: string; pastPredictionSummary: string; currentQuery: string } | null>(null);

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
        setAstralWeather("The astral currents are presently veiled by a velvet curtain of mystery.");
      }
    } catch (e) {
      console.warn("Exception fetching astral weather:", e);
      setAstralWeather("The astral currents are unusually quiet, as if holding their breath in anticipation.");
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  const fetchDailySymbolicFocus = useCallback(async () => {
    setIsDailyFocusLoading(true);
    const today = formatISO(new Date(), { representation: 'date' });
    const storedFocusItem = localStorage.getItem('dailySymbolicFocusItem');
    
    if (storedFocusItem) {
      const { focus, date } = JSON.parse(storedFocusItem);
      if (date === today && focus) {
        setDailySymbolicFocus(focus);
        setIsDailyFocusLoading(false);
        return;
      }
    }

    try {
      const focusResult = await handleGetDailySymbolicFocusAction({ currentDateString: today });
      if (!('error' in focusResult) && focusResult.dailyFocus) {
        setDailySymbolicFocus(focusResult.dailyFocus);
        localStorage.setItem('dailySymbolicFocusItem', JSON.stringify({ focus: focusResult.dailyFocus, date: today }));
      } else if ('error' in focusResult) {
        console.warn("Failed to get daily symbolic focus:", focusResult.error);
        setDailySymbolicFocus("The day's aura is yet to coalesce into a clear sigil.");
      }
    } catch (e) {
      console.warn("Exception fetching daily symbolic focus:", e);
      setDailySymbolicFocus("The day's symbolic signature remains elusive, hidden in the æther.");
    } finally {
      setIsDailyFocusLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAstralWeather();
    fetchDailySymbolicFocus();
  }, [fetchAstralWeather, fetchDailySymbolicFocus]);

  const checkForTemporalEcho = (currentQuery: string): Prediction | null => {
    const pastPredictions = getPredictions().slice(0, 7); 
    const currentQueryLower = currentQuery.toLowerCase().trim().replace(/[^\w\s]/gi, '');
    if (currentQueryLower.length < 10) return null; 

    const currentWordsBase = currentQueryLower.split(" ").filter(w => w.length > 3);
    if (currentWordsBase.length < 2) return null;
    const currentWords = new Set(currentWordsBase);

    for (const p of pastPredictions) {
      const pastQueryLower = p.query.toLowerCase().trim().replace(/[^\w\s]/gi, '');
      const pastWordsBase = pastQueryLower.split(" ").filter(w => w.length > 3);
      if (pastWordsBase.length < 2) continue;
      const pastWords = new Set(pastWordsBase);
      
      let commonWords = 0;
      currentWords.forEach(word => {
        if (pastWords.has(word)) {
          commonWords++;
        }
      });
      if (currentWords.size > 0 && pastWords.size > 0 && (commonWords / Math.max(currentWords.size, pastWords.size)) > 0.65 && commonWords >=2) {
        return p;
      }
    }
    return null;
  };

  const performGenerateInsights = async (currentQuery: string) => {
    let journalHistorySummary = "";
    const pastPredictions = getPredictions();
    if (pastPredictions.length > 0) {
      const predictionsText = pastPredictions
        .map(p => `On ${format(new Date(p.date), 'PPP')}, Query: "${p.query}", AstraKairos Said: "${p.prediction}"`)
        .slice(0, 10) 
        .join('\n\n---\n\n');

      const summaryInput: SummarizePredictionsInput = { predictions: `Recent chronicles of fate from the Oracle's memory:\n${predictionsText}` };
      const summaryResult = await handleSummarizePredictionsAction(summaryInput);

      if (!('error' in summaryResult) && summaryResult.archetypalSummary) {
        journalHistorySummary = summaryResult.archetypalSummary;
      } else if ('error' in summaryResult) {
        console.warn("Failed to distill archetypal summary:", summaryResult.error);
      }
    }

    const insightsInput: GenerateInsightsInput = {
      query: currentQuery,
      journalHistory: journalHistorySummary || undefined,
      symbolicSeed: currentSymbolicSeed || undefined,
      chronoSymbolicMomentDate: chronoDate || undefined,
      chronoSymbolicMomentFeeling: chronoFeeling || undefined,
      dailySymbolicFocus: dailySymbolicFocus || undefined,
    };
    const result = await handleGenerateInsightsAction(insightsInput);

    if ('error' in result) {
      setError(result.error);
      toast({ variant: "destructive", title: "AstraKairos Stumbles", description: result.error });
    } else {
      setPrediction(result);
      toast({ title: "The Oracle Has Spoken!", description: "Your glimpse into the æther has arrived.", className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
    }
  };

  const handleSubmit = () => {
    if (!query.trim()) {
      setError("Whisper your query into the æther, seeker of truths.");
      toast({ variant: "destructive", title: "Empty Query", description: "Pose your question to the Oracle." });
      return;
    }
    setError(null);
    setPrediction(null);

    const echo = checkForTemporalEcho(query);
    if (echo) {
      setTemporalEchoData({ pastQuery: echo.query, pastPredictionSummary: echo.prediction, currentQuery: query });
      setShowTemporalEchoDialog(true);
    } else {
      startTransition(() => performGenerateInsights(query));
    }
  };
  
  const handleTemporalEchoDialogClose = (proceed: boolean) => {
    setShowTemporalEchoDialog(false);
    if (proceed && temporalEchoData) {
      startTransition(() => performGenerateInsights(temporalEchoData.currentQuery));
    }
    setTemporalEchoData(null);
  };

  const handleSaveToJournal = () => {
    if (prediction && query && prediction.journalSummaryForUser) {
      addPredictionToJournal({
        query,
        prediction: prediction.journalSummaryForUser,
        predictionText: prediction.journalSummaryForUser,
        visualizationHint: prediction.emergentArchetypeVisualizationSeed,
        auraPaletteSeed: prediction.auraPaletteSeed, 
        dailySymbolicFocusUsed: dailySymbolicFocus || undefined, 
        symbolicSeedUsed: currentSymbolicSeed || undefined,
        chronoSymbolicMomentDate: chronoDate || undefined,
        chronoSymbolicMomentFeeling: chronoFeeling || undefined,
      });
      toast({ title: "Wisdom Chronicled", description: "AstraKairos's words are etched in the Oracle's Chronicle.", className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
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
        toast({ title: "Symbolic Seed Transformed!", description: `New seed: "${result.evolvedSeed}". It shall guide your next seeking.`, className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
      } else if ('error' in result) {
        toast({ variant: "destructive", title: "Seed Transformation Failed", description: result.error });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Seed Transformation Error", description: e.message || "An unseen force interfered with the ætheric threads." });
    } finally {
      setIsEvolvingSeed(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 pb-16">
      <header className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-4 mb-3">
          <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" /> AstraKairos <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" />
        </h1>
        <p className="mt-2 text-xl md:text-2xl text-muted-foreground font-serif italic text-flicker">
          The All-Seeing Eye Peers into the Mists of Time... What secrets shall it unveil for thee?
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/50 p-4 border-b-2 border-primary/40">
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-lora tracking-wide"><Telescope className="h-6 w-6 text-accent animate-pulse-glow" />Astral Weather Vane</CardTitle>
          </CardHeader>
          <CardContent className="p-4 min-h-[70px] flex items-center justify-center">
            {isWeatherLoading ? <LoadingSpinner size="md" className="text-accent/80" /> : <p className="text-muted-foreground/90 italic text-center text-md font-serif">{astralWeather}</p>}
          </CardContent>
        </Card>
        <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/50 p-4 border-b-2 border-primary/40">
            <CardTitle className="text-lg flex items-center gap-2 text-primary font-lora tracking-wide"><SunMoon className="h-6 w-6 text-accent animate-pulse-glow" />Daily Symbolic Focus</CardTitle>
          </CardHeader>
          <CardContent className="p-4 min-h-[70px] flex items-center justify-center">
            {isDailyFocusLoading ? <LoadingSpinner size="md" className="text-accent/80" /> : <p className="text-muted-foreground/90 italic text-center text-md font-serif">{dailySymbolicFocus}</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/50 p-5 border-b-2 border-primary/40">
          <CardTitle className="text-2xl font-lora text-primary tracking-wider">Offer Your Query to the Oracle</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            The currents of fate stir. Active Symbolic Seed:{" "}
            {currentSymbolicSeed ? (
              <span className="text-accent font-semibold text-flicker">"{currentSymbolicSeed}"</span>
            ) : (
              <span className="text-muted-foreground/80">Initializing mystical seed...</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <div>
              <Label htmlFor="user-query" className="text-lg font-lora text-primary/90 flex items-center gap-2 tracking-wide"><HandCoins className="h-5 w-5 text-accent/90" />Your Question for the Oracle's Gaze:</Label>
              <Textarea
                id="user-query"
                placeholder="E.g., What destiny awaits my heart's true desire, or what path leads to newfound wisdom?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                className="text-lg bg-input/80 focus:bg-input mt-2 p-3 rounded-lg border-2 border-primary/30 focus:border-accent shadow-inner-deep focus:ring-2 focus:ring-ring/50"
                disabled={isPending}
              />
            </div>

            <Accordion type="single" collapsible className="w-full border-t-2 border-b-2 border-primary/20 rounded-lg overflow-hidden shadow-sm">
              <AccordionItem value="chrono-symbolic-moment" className="border-none">
                <AccordionTrigger className="text-md font-lora hover:no-underline text-primary/80 hover:bg-primary/10 p-4 transition-colors duration-200">
                  <div className="flex items-center gap-2 tracking-wide">
                    <Hourglass className="h-5 w-5 text-accent/80 animate-pulse-glow" />
                    Optional: Anchor with a Moment of Power or Feeling
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 bg-background/40 border-t border-primary/20">
                  <div>
                    <Label htmlFor="chrono-date" className="font-lora text-primary/80">Significant Date/Time (Past or Future)</Label>
                    <Input
                      id="chrono-date"
                      type="datetime-local"
                      value={chronoDate}
                      onChange={(e) => setChronoDate(e.target.value)}
                      className="bg-input/80 focus:bg-input mt-1 p-2 rounded-md border-primary/30 focus:border-accent shadow-inner"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="chrono-feeling" className="font-lora text-primary/80">Abstract Temporal Feeling or Aura</Label>
                    <Input
                      id="chrono-feeling"
                      placeholder="E.g., 'The hush before the storm', 'An echo of forgotten laughter'"
                      value={chronoFeeling}
                      onChange={(e) => setChronoFeeling(e.target.value)}
                      className="bg-input/80 focus:bg-input mt-1 p-2 rounded-md border-primary/30 focus:border-accent shadow-inner"
                      disabled={isPending}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-6 rounded-xl shadow-ornate hover:shadow-accent/40 transform hover:scale-[1.03] transition-all duration-200 font-lora tracking-wider" disabled={isPending}>
              {isPending ? <LoadingSpinner className="mr-2.5" /> : <Wand2 className="mr-2.5 h-6 w-6" />}
              Consult AstraKairos
            </Button>
          </form>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <LoadingSpinner size="lg" className="text-accent animate-pulse-glow" />
          <p className="text-2xl text-primary animate-pulse font-lora tracking-wider">AstraKairos consults the swirling mists of fate...</p>
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-ornate border-2 border-destructive/60 rounded-xl bg-destructive/20 fortune-teller-glass-display p-5">
          <Sparkles className="h-6 w-6 text-destructive/80" />
          <AlertTitle className="font-lora text-xl text-destructive-foreground/90">The Vision Clouded by Shadows...</AlertTitle>
          <AlertDescription className="font-serif text-destructive-foreground/80">{error}</AlertDescription>
        </Alert>
      )}

      {prediction && !isPending && (
        <div className="space-y-6 animate-in fade-in duration-700">
          <SectionCard title="Mystic Prelude from the Æther" icon={<Sparkles className="h-7 w-7 text-accent animate-pulse-glow" />}>
            <p className="italic text-lg text-flicker">{prediction.mysticPrelude}</p>
          </SectionCard>

          <SectionCard title="Celestial Harmonies & Cosmic Echoes" icon={<Orbit className="h-7 w-7 text-accent animate-pulse-glow" />} description="Echoes from the starry spheres, woven into this moment's tapestry.">
            {prediction.astrologyInsight}
          </SectionCard>

          <SectionCard title="Alchemist's Transmutation in the Soul's Crucible" icon={<TestTube2 className="h-7 w-7 text-accent animate-pulse-glow" />} description="Transformative processes mirrored in the heart of your query.">
            {prediction.alchemicalReflection}
          </SectionCard>

          <SectionCard title="Oracle's Spread: Threads of Past, Present & Potential" icon={<Layers3 className="h-7 w-7 text-accent animate-pulse-glow" />} description={prediction.divinationSpread.introduction}>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold font-lora text-lg text-primary/90">Past Influence: <span className="text-accent/90">{prediction.divinationSpread.past.card}</span></h4>
                <p>{prediction.divinationSpread.past.interpretation}</p>
              </div>
              <Separator className="my-4 bg-border/40" />
              <div>
                <h4 className="font-semibold font-lora text-lg text-primary/90">Present Focus: <span className="text-accent/90">{prediction.divinationSpread.present.card}</span></h4>
                <p>{prediction.divinationSpread.present.interpretation}</p>
              </div>
              <Separator className="my-4 bg-border/40" />
              <div>
                <h4 className="font-semibold font-lora text-lg text-primary/90">Future's Whisper: <span className="text-accent/90">{prediction.divinationSpread.futurePotential.card}</span></h4>
                <p>{prediction.divinationSpread.futurePotential.interpretation}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Psionic Echo & Clairvoyant Glimpse from the Veil" icon={<Brain className="h-7 w-7 text-accent animate-pulse-glow" />} description="Whispers from the subtle tapestry of probability and potential.">
            <p className="italic">{prediction.psionicClairvoyantFlash.description}</p>
            {prediction.psionicClairvoyantFlash.imageryTags && prediction.psionicClairvoyantFlash.imageryTags.length > 0 && (
              <div className="mt-4">
                <h5 className="text-md font-semibold font-lora text-primary/80 mb-2 flex items-center gap-1.5"><Tags className="h-5 w-5" />Symbolic Imagery Tags:</h5>
                <div className="flex flex-wrap gap-2">
                  {prediction.psionicClairvoyantFlash.imageryTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm bg-primary/20 text-primary-foreground/80 border border-primary/40 shadow-sm px-3 py-1 rounded-md">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Observed Symbolic Signatures & Energetic Weave" icon={<Eye className="h-7 w-7 text-accent animate-pulse-glow" />} description="Key patterns and energies noted by AstraKairos in this unique constellation.">
            <p>{prediction.observedSymbolicSignatures}</p>
          </SectionCard>

          <SectionCard title="Mystic Counsel for Your Path" icon={<BookHeart className="h-7 w-7 text-accent animate-pulse-glow" />} description="Steps to align with the revealed currents and integrate the vision.">
            {prediction.mysticGuidance}
          </SectionCard>

          <SectionCard title="AstraKairos's Parting Word, Sealed in Starlight" icon={<Sparkles className="h-7 w-7 text-accent animate-pulse-glow" />}>
            <p className="italic text-lg text-flicker">{prediction.finalWord}</p>
          </SectionCard>

          <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
            <CardHeader className="bg-secondary/50 p-4 border-b-2 border-primary/40">
              <CardTitle className="text-xl flex items-center gap-2 font-lora text-primary tracking-wide">
                <Scroll className="h-6 w-6 text-accent" />Scribe this Vision into the Chronicle
              </CardTitle>
              <CardDescription className="font-serif italic text-muted-foreground">Record the essence of this divination. Includes seeds for visualization.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="italic text-muted-foreground/90 whitespace-pre-wrap text-md font-serif">{prediction.journalSummaryForUser}</p>
              <p className="text-sm text-accent/80 mt-3 italic font-serif">Archetype Seed: <span className="font-semibold">{prediction.emergentArchetypeVisualizationSeed}</span></p>
              <p className="text-sm text-accent/80 mt-1 italic font-serif">Aura Palette Seed: <span className="font-semibold">{prediction.auraPaletteSeed}</span></p>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-4 p-4 bg-secondary/30 border-t-2 border-primary/20">
              <Button onClick={handleSaveToJournal} variant="outline" className="w-full sm:flex-1 bg-primary/20 hover:bg-primary/30 border-primary/60 text-primary-foreground hover:text-foreground font-lora text-md py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all">
                Save to Oracle's Chronicle
              </Button>
              <Button
                onClick={handleEvolveSeed}
                variant="outline"
                className="w-full sm:flex-1 border-accent/70 text-accent hover:bg-accent/20 font-lora text-md py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={isEvolvingSeed || isPending || !currentSymbolicSeed || !prediction?.journalSummaryForUser}
              >
                {isEvolvingSeed ? <LoadingSpinner className="mr-2" size="sm" /> : <Feather className="mr-2 h-5 w-5" />}
                Evolve Symbolic Seed
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 p-4 border-b-2 border-primary/40">
                <CardTitle className="text-xl font-lora text-primary flex items-center gap-2 tracking-wide"><Zap className="h-6 w-6 text-accent" />Cosmic Archetype Visualization</CardTitle>
                <CardDescription className="font-serif italic text-muted-foreground">Seed: "<span className="font-semibold text-accent">{prediction.emergentArchetypeVisualizationSeed}</span>"</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-video w-full overflow-hidden rounded-xl border-2 border-primary/30 shadow-inner-deep bg-background/60 flex items-center justify-center relative group">
                  <Image
                    src="https://placehold.co/600x400.png"
                    alt="Cosmic Archetype Visualization Placeholder"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full opacity-30 group-hover:opacity-40 transition-opacity"
                    data-ai-hint={`mystical ${prediction.emergentArchetypeVisualizationSeed} antique ornate`}
                  />
                  <Sparkles className="absolute h-16 w-16 md:h-24 md:w-24 text-accent/50 animate-pulse-glow opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
              <CardHeader className="bg-secondary/50 p-4 border-b-2 border-primary/40">
                <CardTitle className="text-xl font-lora text-primary flex items-center gap-2 tracking-wide"><Palette className="h-6 w-6 text-accent" />Aura Palette Visualization</CardTitle>
                <CardDescription className="font-serif italic text-muted-foreground">Seed: "<span className="font-semibold text-accent">{prediction.auraPaletteSeed}</span>"</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="aspect-video w-full overflow-hidden rounded-xl border-2 border-primary/30 shadow-inner-deep bg-background/60 flex items-center justify-center relative group">
                  <Image
                    src="https://placehold.co/600x400.png" 
                    alt="Aura Palette Visualization Placeholder"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full opacity-30 group-hover:opacity-40 transition-opacity"
                    data-ai-hint={`abstract aura ${prediction.auraPaletteSeed} energy colorful`}
                  />
                  <Sigma className="absolute h-16 w-16 md:h-24 md:w-24 text-primary/50 animate-pulse-glow opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Card className="shadow-ornate bg-card/60 backdrop-blur-sm mt-12 border-2 border-primary/20 rounded-xl">
        <CardHeader className="bg-secondary/40 p-4 border-b border-primary/20">
          <CardTitle className="text-lg font-lora text-primary/90 tracking-wide">AstraKairos Caveats & Mystic Disclaimers</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground/90 space-y-3 p-5 font-serif leading-relaxed">
          <p>Visions unveiled by AstraKairos are woven from the threads of artificial intuition, interpreting symbolic systems and archetypal echoes within the digital æther. They are offered for personal contemplation, inspiration, and the spark of amusement.</p>
          <p>These divinations are but reflections in a digital scrying glass, not immutable decrees of fate, nor substitutes for professional counsel. For matters of corporeal health, intricate law, worldly finance, or the labyrinth of the mind, seek guidance from qualified mortals.</p>
          <p>AstraKairos operates within the currents of symbolic interpretation and does not claim true prescience. It retains no personal data beyond the immediate context of your queries and the chronicles you choose to keep within this sacred application's memory.</p>
        </CardContent>
      </Card>

      {showTemporalEchoDialog && temporalEchoData && (
        <AlertDialog open={showTemporalEchoDialog} onOpenChange={setShowTemporalEchoDialog}>
          <AlertDialogContent className="dialog-content-ornate">
            <AlertDialogHeader className="dialog-header-ornate">
              <AlertDialogTitle className="dialog-title-ornate flex items-center gap-2"><Layers3 className="text-accent h-7 w-7 animate-pulse-glow"/>Temporal Echo Detected!</AlertDialogTitle>
              <AlertDialogDescription className="dialog-description-ornate text-left text-md">
                AstraKairos senses a familiar pattern in your query: <strong className="text-primary/90">"{temporalEchoData.currentQuery}"</strong>.
                <br /><br />
                It resonates with a past seeking regarding <strong className="text-primary/90">"{temporalEchoData.pastQuery}"</strong>, where the core insight was:
                <blockquote className="mt-2 p-3 border-l-4 border-primary/50 bg-secondary/30 rounded-md text-sm italic text-foreground/80 shadow-inner">
                  {temporalEchoData.pastPredictionSummary}
                </blockquote>
                <br/>
                Do you wish to delve anew into these familiar currents, or pause to reflect upon this echo from the Oracle's memory?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="dialog-footer-ornate">
              <AlertDialogCancel onClick={() => handleTemporalEchoDialogClose(false)} className="font-lora text-md">Reflect Further</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleTemporalEchoDialogClose(true)} className="font-lora text-md bg-accent hover:bg-accent/90 text-accent-foreground">Consult Anew</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
