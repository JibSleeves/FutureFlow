
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { useJournal } from '@/contexts/journal-context';
import type { Prediction } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SummarizePredictionsInput } from '@/ai/flows/summarize-predictions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollText, Lightbulb, Terminal, BrainCircuit } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { format } from 'date-fns';
import { handleSummarizePredictionsAction } from './actions';

export default function JournalPageClient() {
  const { predictions, getPredictions, clearJournal } = useJournal();
  const [journalEntries, setJournalEntries] = useState<Prediction[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setJournalEntries(getPredictions());
  }, [predictions, getPredictions]);

  const handleSummarize = () => {
    if (journalEntries.length === 0) {
      setError("Your journal is empty. Add some predictions first!");
      toast({
        variant: "default",
        title: "Journal Empty",
        description: "Add some predictions before summarizing.",
      });
      return;
    }
    setError(null);
    setSummary(null);

    const predictionsText = journalEntries
      .map(p => `Date: ${format(new Date(p.date), 'PPP')}\nQuery: ${p.query}\nPrediction: ${p.prediction}`)
      .join('\n\n---\n\n');

    startSummaryTransition(async () => {
      const result = await handleSummarizePredictionsAction({ predictions: predictionsText });
      if ('error' in result) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Summarization Error",
          description: result.error,
        });
      } else {
        setSummary(result.summary);
        toast({
          title: "Path Summarized",
          description: "AstraKairos has distilled the essence of your past divinations.",
        });
      }
    });
  };
  
  const handleClearJournal = () => {
    clearJournal();
    setSummary(null);
    setError(null);
    toast({
      title: "Journal Cleared",
      description: "All your past predictions have been removed from AstraKairos's sight.",
    });
  };


  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Your Future Journal</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Reflect on past divinations and allow AstraKairos to illuminate overarching themes in your journey.
        </p>
      </header>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><BrainCircuit className="text-accent h-6 w-6"/>AstraKairos's Reflections</CardTitle>
          <CardDescription>Let AstraKairos summarize the recurring patterns and wisdom from your past predictions, drawing from its long-term memory analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSummarizing && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
          {summary && !isSummarizing && (
            <div className="p-4 border border-dashed border-accent rounded-md bg-accent/10">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          )}
          {error && !isSummarizing && (
            <Alert variant="destructive" className="shadow-md mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Summarization Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!summary && !isSummarizing && journalEntries.length > 0 && (
            <p className="text-center text-muted-foreground py-4">
              Invoke AstraKairos to summarize your path.
            </p>
          )}
           {!summary && !isSummarizing && journalEntries.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Your journal is empty. Seek a divination to begin.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button 
            onClick={handleSummarize} 
            disabled={isSummarizing || journalEntries.length === 0} 
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSummarizing ? <LoadingSpinner className="mr-2" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Summarize My Path
          </Button>
          <Button 
            onClick={handleClearJournal} 
            variant="destructive" 
            disabled={journalEntries.length === 0}
            className="w-full sm:w-auto"
          >
            Clear Journal
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
              <Card key={entry.id} className="shadow-lg bg-card/60 backdrop-blur-xs hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl"><ScrollText className="text-primary"/>Query</CardTitle>
                  <CardDescription className="text-sm italic">
                    Asked on {format(new Date(entry.date), 'MMMM d, yyyy \'at\' h:mm a')}
                  </CardDescription>
                  <p className="pt-1">{entry.query}</p>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1 text-primary">AstraKairos's Journaled Insight:</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.prediction}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
