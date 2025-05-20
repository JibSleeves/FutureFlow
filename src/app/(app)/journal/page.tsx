
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { useJournal } from '@/contexts/journal-context';
import type { Prediction } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollText, Lightbulb, Link2, Trash2, BookOpenCheck, Sparkles, BookMarked } from "lucide-react"; // Updated icons
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { format } from 'date-fns';
import { handleSummarizePredictionsAction, handleLinkKarmicEchoesAction } from './actions';
import { adaptPredictionForKarmicLink } from '@/lib/adapters';

export default function JournalPageClient() {
  const { predictions, getPredictions, clearJournal } = useJournal();
  const [journalEntries, setJournalEntries] = useState<Prediction[]>([]);
  const [archetypalSummary, setArchetypalSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();
  const { toast } = useToast();

  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
  const [karmicLinkAnalysis, setKarmicLinkAnalysis] = useState<string | null>(null);
  const [isLinking, startLinkTransition] = useTransition();


  useEffect(() => {
    setJournalEntries(getPredictions());
  }, [predictions, getPredictions]);

  const handleSummarize = () => {
    if (journalEntries.length === 0) {
      setError("The Chronicle is bare. Seek AstraKairos's wisdom first!");
      toast({ variant: "default", title: "Chronicle Empty", description: "Add divinations before seeking patterns.", className: "bg-secondary/70 border-secondary text-secondary-foreground" });
      return;
    }
    setError(null);
    setKarmicLinkAnalysis(null); 
    setArchetypalSummary(null);

    const predictionsText = journalEntries
      .map(p => `Date: ${format(new Date(p.date), 'PPP')}\nQuery: ${p.query}\nPrediction: ${p.prediction}`)
      .join('\n\n---\n\n');

    startSummaryTransition(async () => {
      const result = await handleSummarizePredictionsAction({ predictions: predictionsText });
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Pattern Obscured", description: result.error });
      } else {
        setArchetypalSummary(result.archetypalSummary);
        toast({ title: "Path Illuminated", description: "AstraKairos has distilled the essence of your chronicles.", className: "bg-primary/10 border-primary text-primary-foreground" });
      }
    });
  };
  
  const handleClearJournal = () => {
    clearJournal();
    setArchetypalSummary(null);
    setKarmicLinkAnalysis(null);
    setSelectedEntryIds([]);
    setError(null);
    toast({ title: "Chronicle Wiped Clean", description: "The Oracle's slate is cleared.", className: "bg-destructive/10 border-destructive text-destructive-foreground" });
  };

  const handleToggleSelection = (entryId: string) => {
    setSelectedEntryIds(prev => {
      if (prev.includes(entryId)) {
        return prev.filter(id => id !== entryId);
      }
      if (prev.length < 2) {
        return [...prev, entryId];
      }
      return [prev[1], entryId];
    });
  };

  const handleLinkEchoes = () => {
    if (selectedEntryIds.length !== 2) {
      toast({ variant: "destructive", title: "Selection Incomplete", description: "Choose two chronicles to weave their threads." });
      return;
    }
    setError(null);
    setArchetypalSummary(null); 
    setKarmicLinkAnalysis(null);

    const entry1 = journalEntries.find(e => e.id === selectedEntryIds[0]);
    const entry2 = journalEntries.find(e => e.id === selectedEntryIds[1]);

    if (!entry1 || !entry2) {
      toast({ variant: "destructive", title: "Chronicle Lost", description: "Selected entries not found in the mists." });
      return;
    }
    
    const sortedEntries = [entry1, entry2].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    startLinkTransition(async () => {
      const input = {
        reading1: adaptPredictionForKarmicLink(sortedEntries[0]),
        reading2: adaptPredictionForKarmicLink(sortedEntries[1]),
      };
      const result = await handleLinkKarmicEchoesAction(input);
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Echoes Unclear", description: result.error });
      } else {
        setKarmicLinkAnalysis(result.karmicLinkAnalysis);
        toast({ title: "Karmic Threads Revealed", description: "AstraKairos unveils the connections.", className: "bg-primary/10 border-primary text-primary-foreground" });
      }
    });
  };


  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-16">
      <header className="text-center py-6">
        <h1 className="text-5xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-3 mb-2">
          <BookMarked className="h-12 w-12 text-accent fortune-teller-glow" /> Oracle's Chronicle
        </h1>
        <p className="mt-2 text-xl text-muted-foreground font-serif italic">
          Reflect upon past visions. AstraKairos may illuminate overarching patterns or link fateful echoes.
        </p>
      </header>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
          <CardTitle className="text-2xl flex items-center gap-2 font-serif text-primary"><Sparkles className="text-accent h-7 w-7 animate-pulse"/>AstraKairos's Reflections</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">Distill recurring motifs from all chronicles, or link karmic threads between two specific visions.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 min-h-[150px]">
          {(isSummarizing || isLinking) && <div className="flex justify-center py-4"><LoadingSpinner className="text-accent"/></div>}
          
          {archetypalSummary && !isSummarizing && !isLinking && (
            <div className="p-4 my-4 border-2 border-dashed border-accent/70 rounded-lg bg-accent/10 shadow-inner">
              <h3 className="text-lg font-semibold text-accent mb-2 font-serif">Archetypal Path Illumination:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">{archetypalSummary}</p>
            </div>
          )}

          {karmicLinkAnalysis && !isLinking && !isSummarizing && (
            <div className="p-4 my-4 border-2 border-dashed border-primary/70 rounded-lg bg-primary/10 shadow-inner">
              <h3 className="text-lg font-semibold text-primary mb-2 font-serif">Karmic Thread Analysis:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">{karmicLinkAnalysis}</p>
              <p className="text-xs text-muted-foreground mt-3 font-serif">Analysis based on entries from: {selectedEntryIds.map(id => format(new Date(journalEntries.find(e=>e.id===id)?.date || Date.now()), 'MMMM d, yyyy')).join(' & ')}</p>
            </div>
          )}

          {error && !isSummarizing && !isLinking && (
            <Alert variant="destructive" className="shadow-md mt-4">
              <Sparkles className="h-4 w-4" />
              <AlertTitle className="font-serif">Reflection Error</AlertTitle>
              <AlertDescription className="font-serif">{error}</AlertDescription>
            </Alert>
          )}
          {!archetypalSummary && !karmicLinkAnalysis && !isSummarizing && !isLinking && journalEntries.length > 0 && (
            <p className="text-center text-muted-foreground py-4 font-serif italic">
              Invoke AstraKairos to summarize your path or link echoes between two entries.
            </p>
          )}
           {!archetypalSummary && !karmicLinkAnalysis && !isSummarizing && !isLinking && journalEntries.length === 0 && (
            <p className="text-center text-muted-foreground py-4 font-serif italic">
              The Oracle's Chronicle is empty. Seek a vision to begin.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-4 border-t-2 border-primary/20 bg-secondary/20">
          <Button 
            onClick={handleSummarize} 
            disabled={isSummarizing || isLinking || journalEntries.length === 0} 
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-serif text-md py-3 rounded-md shadow-md hover:shadow-lg transition-all"
          >
            {isSummarizing ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-5 w-5" />}
            Summarize Archetypal Path
          </Button>
           <Button 
            onClick={handleLinkEchoes} 
            disabled={isLinking || isSummarizing || selectedEntryIds.length !== 2} 
            className="w-full sm:w-auto border-primary/70 text-primary hover:bg-primary/20 font-serif text-md py-3 rounded-md shadow-md hover:shadow-lg transition-all"
            variant="outline"
          >
            {isLinking ? <LoadingSpinner className="mr-2" /> : <Link2 className="mr-2 h-5 w-5" />}
            Link Karmic Threads (Select 2)
          </Button>
          <Button 
            onClick={handleClearJournal} 
            variant="destructive" 
            disabled={journalEntries.length === 0}
            className="w-full sm:w-auto font-serif text-md py-3 rounded-md shadow-md hover:shadow-lg transition-all"
          >
            <Trash2 className="mr-2 h-5 w-5" /> Clear Chronicle
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6 mt-10">
        <h2 className="text-3xl font-lora font-semibold text-center text-primary">Past Visions</h2>
        {journalEntries.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-8 font-serif italic">
            The pages of your Chronicle are currently blank.
            <br />
            Seek AstraKairos's counsel to begin your journey.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {journalEntries.map((entry) => (
              <Card key={entry.id} className={cn("shadow-lg bg-card/80 backdrop-blur-xs hover:shadow-primary/30 transition-shadow duration-300 border-2 border-primary/20 rounded-lg overflow-hidden", selectedEntryIds.includes(entry.id) ? 'ring-2 ring-offset-2 ring-offset-background ring-accent shadow-accent/30' : 'hover:border-primary/40')}>
                <CardHeader className="bg-secondary/30 p-4 border-b border-primary/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-serif text-primary"><ScrollText className="text-accent h-6 w-6"/>Query Made</CardTitle>
                      <CardDescription className="text-sm italic text-muted-foreground font-serif">
                        Asked on {format(new Date(entry.date), 'MMMM d, yyyy \'at\' h:mm a')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                       <Label htmlFor={`select-${entry.id}`} className="text-sm font-serif text-muted-foreground cursor-pointer hover:text-primary">Select</Label>
                      <Checkbox
                        id={`select-${entry.id}`}
                        checked={selectedEntryIds.includes(entry.id)}
                        onCheckedChange={() => handleToggleSelection(entry.id)}
                        disabled={selectedEntryIds.length >= 2 && !selectedEntryIds.includes(entry.id)}
                        className="border-primary/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent-foreground"
                      />
                    </div>
                  </div>
                  <p className="pt-2 font-serif text-foreground/90">{entry.query}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 text-primary font-serif flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-accent"/>AstraKairos's Chronicled Insight:</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-serif">{entry.prediction}</p>
                  {entry.visualizationHint && <p className="text-xs text-accent/80 mt-2 italic font-serif">Visualization Seed: {entry.visualizationHint}</p>}
                  {entry.symbolicSeedUsed && <p className="text-xs text-primary/70 mt-1 italic font-serif">Symbolic Seed Used: {entry.symbolicSeedUsed}</p>}
                   {entry.chronoSymbolicMomentDate && <p className="text-xs text-muted-foreground/80 mt-1 italic font-serif">Chrono Date: {format(new Date(entry.chronoSymbolicMomentDate), 'MMM d, yyyy, h:mm a')}</p>}
                  {entry.chronoSymbolicMomentFeeling && <p className="text-xs text-muted-foreground/80 mt-1 italic font-serif">Chrono Feeling: {entry.chronoSymbolicMomentFeeling}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
