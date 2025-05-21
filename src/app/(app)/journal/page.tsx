
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollText, Lightbulb, Link2, Trash2, BookOpenCheck, Sparkles, BookMarked, Milestone, Symmetry, FileText, Wand } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { format } from 'date-fns';
import { handleSummarizePredictionsAction, handleLinkKarmicEchoesAction, handleAnalyzeSymbolicPolarityAction } from './actions';
import { adaptPredictionForKarmicLink } from '@/lib/adapters';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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

  const [polarityAnalysisResult, setPolarityAnalysisResult] = useState<{ originalTheme: string; polarityAnalysis: string; entryQuery: string } | null>(null);
  const [isAnalyzingPolarity, startPolarityTransition] = useTransition();
  const [showPolarityDialog, setShowPolarityDialog] = useState(false);

  useEffect(() => {
    setJournalEntries(getPredictions());
  }, [predictions, getPredictions]);

  const handleSummarize = () => {
    if (journalEntries.length === 0) {
      setError("The Chronicle is bare. Seek AstraKairos's wisdom first, brave soul!");
      toast({ variant: "default", title: "Chronicle Empty", description: "Add divinations before seeking patterns woven in time.", className: "bg-secondary/70 border-secondary text-secondary-foreground shadow-ornate" });
      return;
    }
    setError(null);
    setKarmicLinkAnalysis(null);
    setPolarityAnalysisResult(null);
    setArchetypalSummary(null);

    const predictionsText = journalEntries
      .map(p => `Date: ${format(new Date(p.date), 'PPP')}\nQuery: ${p.query}\nPrediction: ${p.prediction}`)
      .slice(0,15) // Use more entries for summary
      .join('\n\n---\n\n');

    startSummaryTransition(async () => {
      const result = await handleSummarizePredictionsAction({ predictions: `Echoes from the Oracle's Chronicle:\n${predictionsText}` });
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Pattern Obscured", description: result.error });
      } else {
        setArchetypalSummary(result.archetypalSummary);
        toast({ title: "Path Illuminated", description: "AstraKairos has distilled the essence of your chronicles.", className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
      }
    });
  };

  const handleClearJournal = () => {
    clearJournal();
    setArchetypalSummary(null);
    setKarmicLinkAnalysis(null);
    setPolarityAnalysisResult(null);
    setSelectedEntryIds([]);
    setError(null);
    toast({ title: "Chronicle Wiped Clean", description: "The Oracle's slate is cleared, awaiting new prophecies.", className: "bg-destructive/20 border-destructive/50 text-destructive-foreground shadow-ornate" });
  };

  const handleToggleSelection = (entryId: string) => {
    setSelectedEntryIds(prev => {
      if (prev.includes(entryId)) {
        return prev.filter(id => id !== entryId);
      }
      if (prev.length < 2) {
        return [...prev, entryId];
      }
      // If 2 are already selected, deselect the first one and add the new one.
      return [prev[1], entryId]; 
    });
  };

  const handleLinkEchoes = () => {
    if (selectedEntryIds.length !== 2) {
      toast({ variant: "destructive", title: "Selection Incomplete", description: "Choose precisely two chronicles to weave their threads of fate." });
      return;
    }
    setError(null);
    setArchetypalSummary(null);
    setPolarityAnalysisResult(null);
    setKarmicLinkAnalysis(null);

    const entry1 = journalEntries.find(e => e.id === selectedEntryIds[0]);
    const entry2 = journalEntries.find(e => e.id === selectedEntryIds[1]);

    if (!entry1 || !entry2) {
      toast({ variant: "destructive", title: "Chronicle Lost in Time", description: "Selected entries not found in the mists of memory." });
      return;
    }

    const sortedEntries = [entry1, entry2].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
        toast({ title: "Karmic Threads Revealed", description: "AstraKairos unveils the connections woven between time.", className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
      }
    });
  };

  const handleAnalyzePolarity = (entry: Prediction) => {
    setError(null);
    setArchetypalSummary(null);
    setKarmicLinkAnalysis(null);
    setPolarityAnalysisResult(null);

    startPolarityTransition(async () => {
      const input = {
        readingQuery: entry.query,
        readingSummary: entry.prediction,
        readingDate: entry.date,
      };
      const result = await handleAnalyzeSymbolicPolarityAction(input);
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Polarity Obscured", description: result.error });
      } else {
        setPolarityAnalysisResult({ ...result, entryQuery: entry.query });
        setShowPolarityDialog(true);
        toast({ title: "Symbolic Polarity Revealed", description: "AstraKairos offers a counterpoint to the vision.", className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
      }
    });
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 pb-16"> {/* Increased max-width */}
      <header className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-4 mb-3">
          <BookMarked className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" /> Oracle's Chronicle <BookMarked className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" />
        </h1>
        <p className="mt-2 text-xl md:text-2xl text-muted-foreground font-serif italic text-flicker">
          Reflect upon past visions. AstraKairos may illuminate overarching patterns or link fateful echoes from the mists of time.
        </p>
      </header>

      <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/50 p-5 border-b-2 border-primary/40">
          <CardTitle className="text-2xl flex items-center gap-2.5 font-lora text-primary tracking-wider"><Wand className="text-accent h-7 w-7 animate-pulse-glow" />AstraKairos's Reflections on the Weave</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">Distill recurring motifs, link karmic threads between two visions, or analyze a single vision's symbolic polarity.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 min-h-[180px]">
          {(isSummarizing || isLinking || isAnalyzingPolarity) && <div className="flex justify-center items-center py-6 h-full"><LoadingSpinner size="lg" className="text-accent animate-pulse-glow" /></div>}

          {archetypalSummary && !isSummarizing && !isLinking && !isAnalyzingPolarity && (
            <div className="p-5 my-4 border-2 border-dashed border-accent/70 rounded-lg bg-accent/10 shadow-inner-deep animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold text-accent mb-3 font-lora tracking-wide flex items-center gap-2"><Lightbulb className="h-6 w-6"/>Archetypal Path Illumination:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90 font-serif">{archetypalSummary}</p>
            </div>
          )}

          {karmicLinkAnalysis && !isLinking && !isSummarizing && !isAnalyzingPolarity && (
            <div className="p-5 my-4 border-2 border-dashed border-primary/70 rounded-lg bg-primary/10 shadow-inner-deep animate-in fade-in duration-500">
              <h3 className="text-xl font-semibold text-primary mb-3 font-lora tracking-wide flex items-center gap-2"><Link2 className="h-6 w-6"/>Karmic Thread Analysis:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90 font-serif">{karmicLinkAnalysis}</p>
              <p className="text-xs text-muted-foreground mt-4 font-serif">Analysis based on entries from: {selectedEntryIds.map(id => format(new Date(journalEntries.find(e => e.id === id)?.date || Date.now()), 'MMMM d, yyyy')).join(' & ')}</p>
            </div>
          )}

          {error && !isSummarizing && !isLinking && !isAnalyzingPolarity &&(
            <Alert variant="destructive" className="shadow-ornate mt-4">
              <Sparkles className="h-5 w-5" />
              <AlertTitle className="font-lora text-lg">Reflection Error by the Oracle</AlertTitle>
              <AlertDescription className="font-serif">{error}</AlertDescription>
            </Alert>
          )}
          {!archetypalSummary && !karmicLinkAnalysis && !polarityAnalysisResult && !isSummarizing && !isLinking && !isAnalyzingPolarity && journalEntries.length > 0 && (
            <p className="text-center text-muted-foreground/80 py-6 font-serif italic text-lg">
              Invoke AstraKairos to summarize your path, link echoes between visions, or analyze a singular prophecy's polarity.
            </p>
          )}
          {!archetypalSummary && !karmicLinkAnalysis && !polarityAnalysisResult && !isSummarizing && !isLinking && !isAnalyzingPolarity && journalEntries.length === 0 && (
            <p className="text-center text-muted-foreground/80 py-6 font-serif italic text-lg">
              The Oracle's Chronicle is empty. Seek a vision from AstraKairos to begin your journey through time.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 p-5 border-t-2 border-primary/30 bg-secondary/30 flex-wrap">
          <Button
            onClick={handleSummarize}
            disabled={isSummarizing || isLinking || isAnalyzingPolarity || journalEntries.length === 0}
            className="w-full sm:flex-1 md:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-lora text-md py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {isSummarizing ? <LoadingSpinner className="mr-2" /> : <FileText className="mr-2 h-5 w-5" />}
            Summarize Archetypal Path
          </Button>
          <Button
            onClick={handleLinkEchoes}
            disabled={isLinking || isSummarizing || isAnalyzingPolarity || selectedEntryIds.length !== 2}
            className="w-full sm:flex-1 md:w-auto border-primary/70 text-primary hover:bg-primary/20 font-lora text-md py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            variant="outline"
          >
            {isLinking ? <LoadingSpinner className="mr-2" /> : <Link2 className="mr-2 h-5 w-5" />}
            Link Karmic Threads (Select 2)
          </Button>
          <Button
            onClick={handleClearJournal}
            variant="destructive"
            disabled={isSummarizing || isLinking || isAnalyzingPolarity || journalEntries.length === 0}
            className="w-full sm:flex-1 md:w-auto font-lora text-md py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Trash2 className="mr-2 h-5 w-5" /> Clear Chronicle
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-8 mt-12">
        <h2 className="text-4xl font-lora font-semibold text-center text-primary tracking-wider">Scrolls of Past Visions</h2>
        {journalEntries.length === 0 ? (
          <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden p-8">
            <p className="text-center text-muted-foreground text-xl py-10 font-serif italic">
              The pages of your Chronicle are currently blank, echoing with silence.
              <br />
              Seek AstraKairos's counsel to begin etching your journey into its mystical records.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {journalEntries.map((entry) => (
              <Card key={entry.id} className={cn("shadow-ornate bg-card/80 backdrop-blur-sm hover:shadow-primary/40 transition-all duration-300 border-2 border-primary/20 rounded-xl overflow-hidden flex flex-col", selectedEntryIds.includes(entry.id) ? 'ring-2 ring-offset-background ring-offset-2 ring-accent shadow-accent/40' : 'hover:border-primary/50')}>
                <CardHeader className="bg-secondary/40 p-4 border-b-2 border-primary/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-lora text-primary tracking-wide"><ScrollText className="text-accent h-6 w-6 animate-pulse-glow" />Query Scribed</CardTitle>
                      <CardDescription className="text-sm italic text-muted-foreground font-serif">
                        Asked on {format(new Date(entry.date), 'MMMM d, yyyy \'at\' h:mm a')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <Label htmlFor={`select-${entry.id}`} className="text-sm font-serif text-muted-foreground cursor-pointer hover:text-primary transition-colors">Select</Label>
                      <Checkbox
                        id={`select-${entry.id}`}
                        checked={selectedEntryIds.includes(entry.id)}
                        onCheckedChange={() => handleToggleSelection(entry.id)}
                        disabled={(selectedEntryIds.length >= 2 && !selectedEntryIds.includes(entry.id)) || isLinking || isSummarizing || isAnalyzingPolarity}
                        className="border-primary/60 data-[state=checked]:bg-accent data-[state=checked]:border-accent-foreground rounded-sm w-5 h-5"
                      />
                    </div>
                  </div>
                  <p className="pt-3 font-serif text-foreground/90 text-md">{entry.query}</p>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-semibold mb-2 text-primary font-lora flex items-center gap-2 text-lg tracking-wide"><BookOpenCheck className="h-5 w-5 text-accent" />AstraKairos's Chronicled Insight:</h3>
                  <p className="text-muted-foreground/90 leading-relaxed whitespace-pre-wrap font-serif text-md">{entry.prediction}</p>
                  {entry.visualizationHint && <p className="text-xs text-accent/80 mt-3 italic font-serif">Archetype Seed: {entry.visualizationHint}</p>}
                  {entry.auraPaletteSeed && <p className="text-xs text-accent/80 mt-1 italic font-serif">Aura Palette Seed: {entry.auraPaletteSeed}</p>}
                  <Separator className="my-3 bg-border/30"/>
                  {entry.dailySymbolicFocusUsed && <p className="text-xs text-primary/70 italic font-serif">Daily Focus active: {entry.dailySymbolicFocusUsed}</p>}
                  {entry.symbolicSeedUsed && <p className="text-xs text-primary/70 italic font-serif">Symbolic Seed Used: {entry.symbolicSeedUsed}</p>}
                  {entry.chronoSymbolicMomentDate && <p className="text-xs text-muted-foreground/80 italic font-serif">Chrono Date: {format(new Date(entry.chronoSymbolicMomentDate), 'MMM d, yyyy, h:mm a')}</p>}
                  {entry.chronoSymbolicMomentFeeling && <p className="text-xs text-muted-foreground/80 italic font-serif">Chrono Feeling: {entry.chronoSymbolicMomentFeeling}</p>}
                </CardContent>
                <CardFooter className="p-3 border-t-2 border-primary/30 bg-secondary/30">
                   <Button 
                    onClick={() => handleAnalyzePolarity(entry)} 
                    variant="outline" 
                    size="sm"
                    className="w-full border-accent/70 text-accent hover:bg-accent/20 font-lora text-sm py-2.5 rounded-md"
                    disabled={isAnalyzingPolarity || isLinking || isSummarizing}
                  >
                    {(isAnalyzingPolarity && polarityAnalysisResult?.entryQuery === entry.query) ? <LoadingSpinner size="sm" className="mr-2"/> : <Symmetry className="mr-2 h-4 w-4"/>}
                    Analyze Symbolic Polarity
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      {showPolarityDialog && polarityAnalysisResult && (
        <AlertDialog open={showPolarityDialog} onOpenChange={setShowPolarityDialog}>
          <AlertDialogContent className="dialog-content-ornate max-w-lg">
            <AlertDialogHeader className="dialog-header-ornate">
              <AlertDialogTitle className="dialog-title-ornate flex items-center gap-2">
                <Symmetry className="text-accent h-7 w-7 animate-pulse-glow"/>Symbolic Polarity Analysis
              </AlertDialogTitle>
              <AlertDialogDescription className="dialog-description-ornate text-left text-md">
                For your query: <strong className="text-primary/90">"{polarityAnalysisResult.entryQuery}"</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 space-y-3 text-md text-foreground/90 font-serif max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
                <p><strong className="text-primary">Identified Core Theme:</strong> {polarityAnalysisResult.originalTheme}</p>
                <Separator className="my-3 bg-border/50"/>
                <p><strong className="text-accent">Polarity Reflection from the Oracle:</strong> {polarityAnalysisResult.polarityAnalysis}</p>
            </div>
            <AlertDialogFooter className="dialog-footer-ornate">
              <AlertDialogAction onClick={() => setShowPolarityDialog(false)} className="font-lora text-md bg-accent hover:bg-accent/90 text-accent-foreground">Close Portal</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
