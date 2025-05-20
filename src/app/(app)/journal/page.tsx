
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
import { ScrollText, Lightbulb, Terminal, BrainCircuit, Link2, Trash2 } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { format } from 'date-fns';
import { handleSummarizePredictionsAction, handleLinkKarmicEchoesAction } from './actions';
import { adaptPredictionForKarmicLink } from '@/lib/adapters'; // Updated import path

export default function JournalPageClient() {
  const { predictions, getPredictions, clearJournal } = useJournal();
  const [journalEntries, setJournalEntries] = useState<Prediction[]>([]);
  const [archetypalSummary, setArchetypalSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();
  const { toast } = useToast();

  // For Karmic Echo Linker
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
  const [karmicLinkAnalysis, setKarmicLinkAnalysis] = useState<string | null>(null);
  const [isLinking, startLinkTransition] = useTransition();


  useEffect(() => {
    setJournalEntries(getPredictions());
  }, [predictions, getPredictions]);

  const handleSummarize = () => {
    if (journalEntries.length === 0) {
      setError("Your journal is empty. Add some predictions first!");
      toast({ variant: "default", title: "Journal Empty", description: "Add some predictions before summarizing." });
      return;
    }
    setError(null);
    setKarmicLinkAnalysis(null); // Clear previous link analysis
    setArchetypalSummary(null);

    const predictionsText = journalEntries
      .map(p => `Date: ${format(new Date(p.date), 'PPP')}\nQuery: ${p.query}\nPrediction: ${p.prediction}`)
      .join('\n\n---\n\n');

    startSummaryTransition(async () => {
      const result = await handleSummarizePredictionsAction({ predictions: predictionsText });
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Summarization Error", description: result.error });
      } else {
        setArchetypalSummary(result.archetypalSummary);
        toast({ title: "Path Summarized", description: "AstraKairos has distilled the archetypal essence of your past divinations." });
      }
    });
  };
  
  const handleClearJournal = () => {
    clearJournal();
    setArchetypalSummary(null);
    setKarmicLinkAnalysis(null);
    setSelectedEntryIds([]);
    setError(null);
    toast({ title: "Journal Cleared", description: "All your past predictions have been removed from AstraKairos's sight." });
  };

  const handleToggleSelection = (entryId: string) => {
    setSelectedEntryIds(prev => {
      if (prev.includes(entryId)) {
        return prev.filter(id => id !== entryId);
      }
      if (prev.length < 2) {
        return [...prev, entryId];
      }
      // If 2 are already selected, replace the first one with the new one
      return [prev[1], entryId];
    });
  };

  const handleLinkEchoes = () => {
    if (selectedEntryIds.length !== 2) {
      toast({ variant: "destructive", title: "Selection Error", description: "Please select exactly two journal entries to link." });
      return;
    }
    setError(null);
    setArchetypalSummary(null); // Clear summary
    setKarmicLinkAnalysis(null);

    const entry1 = journalEntries.find(e => e.id === selectedEntryIds[0]);
    const entry2 = journalEntries.find(e => e.id === selectedEntryIds[1]);

    if (!entry1 || !entry2) {
      toast({ variant: "destructive", title: "Error", description: "Selected entries not found." });
      return;
    }
    
    // Ensure entries are in chronological order for the AI if that matters for analysis (optional)
    const sortedEntries = [entry1, entry2].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    startLinkTransition(async () => {
      const input = {
        reading1: adaptPredictionForKarmicLink(sortedEntries[0]),
        reading2: adaptPredictionForKarmicLink(sortedEntries[1]),
      };
      const result = await handleLinkKarmicEchoesAction(input);
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Karmic Link Error", description: result.error });
      } else {
        setKarmicLinkAnalysis(result.karmicLinkAnalysis);
        toast({ title: "Karmic Echoes Revealed", description: "AstraKairos has analyzed the connection between your selected entries." });
      }
    });
  };


  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Your Future Journal</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Reflect on past divinations. AstraKairos can illuminate overarching themes or link specific karmic echoes.
        </p>
      </header>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><BrainCircuit className="text-accent h-6 w-6"/>AstraKairos's Insights</CardTitle>
          <CardDescription>Distill recurring patterns from all entries, or link karmic echoes between two specific divinations.</CardDescription>
        </CardHeader>
        <CardContent>
          {(isSummarizing || isLinking) && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
          
          {archetypalSummary && !isSummarizing && !isLinking && (
            <div className="p-4 my-4 border border-dashed border-accent rounded-md bg-accent/10">
              <h3 className="text-lg font-semibold text-accent mb-2">Archetypal Path Summary:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{archetypalSummary}</p>
            </div>
          )}

          {karmicLinkAnalysis && !isLinking && !isSummarizing && (
            <div className="p-4 my-4 border border-dashed border-primary rounded-md bg-primary/10">
              <h3 className="text-lg font-semibold text-primary mb-2">Karmic Echo Analysis:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{karmicLinkAnalysis}</p>
              <p className="text-xs text-muted-foreground mt-3">Analysis based on entries from: {selectedEntryIds.map(id => format(new Date(journalEntries.find(e=>e.id===id)?.date || Date.now()), 'MMM d, yyyy')).join(' & ')}</p>
            </div>
          )}

          {error && !isSummarizing && !isLinking && (
            <Alert variant="destructive" className="shadow-md mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!archetypalSummary && !karmicLinkAnalysis && !isSummarizing && !isLinking && journalEntries.length > 0 && (
            <p className="text-center text-muted-foreground py-4">
              Invoke AstraKairos to summarize your path or link echoes between two entries.
            </p>
          )}
           {!archetypalSummary && !karmicLinkAnalysis && !isSummarizing && !isLinking && journalEntries.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Your journal is empty. Seek a divination to begin.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button 
            onClick={handleSummarize} 
            disabled={isSummarizing || isLinking || journalEntries.length === 0} 
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSummarizing ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Summarize Archetypal Path
          </Button>
           <Button 
            onClick={handleLinkEchoes} 
            disabled={isLinking || isSummarizing || selectedEntryIds.length !== 2} 
            className="w-full sm:w-auto"
            variant="outline"
          >
            {isLinking ? <LoadingSpinner className="mr-2" /> : <Link2 className="mr-2 h-4 w-4" />}
            Link Karmic Echoes (Select 2)
          </Button>
          <Button 
            onClick={handleClearJournal} 
            variant="destructive" 
            disabled={journalEntries.length === 0}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Journal
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-center text-primary-foreground">Past Divinations</h2>
        {journalEntries.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-8">
            Your journal is currently empty.
            <br />
            Seek a divination to begin chronicling your future with AstraKairos.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {journalEntries.map((entry) => (
              <Card key={entry.id} className={`shadow-lg bg-card/60 backdrop-blur-xs hover:shadow-primary/20 transition-shadow duration-300 ${selectedEntryIds.includes(entry.id) ? 'ring-2 ring-accent' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl"><ScrollText className="text-primary"/>Query</CardTitle>
                      <CardDescription className="text-sm italic">
                        Asked on {format(new Date(entry.date), 'MMMM d, yyyy \'at\' h:mm a')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox
                        id={`select-${entry.id}`}
                        checked={selectedEntryIds.includes(entry.id)}
                        onCheckedChange={() => handleToggleSelection(entry.id)}
                        disabled={selectedEntryIds.length >= 2 && !selectedEntryIds.includes(entry.id)}
                      />
                      <Label htmlFor={`select-${entry.id}`} className="text-sm">Select</Label>
                    </div>
                  </div>
                  <p className="pt-1">{entry.query}</p>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1 text-primary">AstraKairos's Journaled Insight:</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.prediction}</p>
                  {entry.visualizationHint && <p className="text-xs text-accent/80 mt-2 italic">Visualization Seed: {entry.visualizationHint}</p>}
                  {entry.symbolicSeedUsed && <p className="text-xs text-primary/70 mt-1 italic">Symbolic Seed Used: {entry.symbolicSeedUsed}</p>}
                   {entry.chronoSymbolicMomentDate && <p className="text-xs text-muted-foreground/80 mt-1 italic">Chrono Date: {format(new Date(entry.chronoSymbolicMomentDate), 'PPp')}</p>}
                  {entry.chronoSymbolicMomentFeeling && <p className="text-xs text-muted-foreground/80 mt-1 italic">Chrono Feeling: {entry.chronoSymbolicMomentFeeling}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

    