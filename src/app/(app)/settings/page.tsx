
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJournal } from '@/contexts/journal-context';
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, BookUser, Info, Trash2, Sparkles, Cog, SlidersHorizontal } from "lucide-react"; 

export default function SettingsPage() {
  const { clearJournal } = useJournal();
  const { toast } = useToast();
  const [appVersion, setAppVersion] = React.useState<string | null>(null);
  const [lastCalibration, setLastCalibration] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate dynamic fetching or calculation for version/calibration
    setAppVersion("1.1.0 (Crimson Echoes Edition)");
    const today = new Date();
    setLastCalibration(today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " at " + today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'}));
  }, []);


  const handleClearJournal = () => {
    clearJournal();
    toast({
      title: "Chronicle Wiped Clean by Mystic Winds",
      description: "All past visions and journal entries have vanished from the Oracle's memory, like mist at dawn.",
      variant: "default",
      className: "bg-destructive/20 border-destructive/50 text-destructive-foreground font-serif shadow-ornate"
    });
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-10 pb-16"> {/* Increased max-width and spacing */}
      <header className="text-center py-8 mb-6">
        <h1 className="text-5xl md:text-6xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-4 mb-3">
          <SlidersHorizontal className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" /> {/* Changed Cog to SlidersHorizontal */}
          Oracle's Inner Workings
        </h1>
        <p className="mt-2 text-xl md:text-2xl text-muted-foreground font-serif italic text-flicker">
          Adjust the ætheric gears and gaze upon the arcane design of the FutureFlow Oracle.
        </p>
      </header>

      <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/50 p-6 border-b-2 border-primary/40">
          <CardTitle className="text-2xl flex items-center gap-3 font-lora text-primary tracking-wider">
            <BookUser className="h-7 w-7 text-accent animate-pulse-glow" />
            Oracle's Chronicle Management
          </CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground text-md">
            Manage the memories stored within the Oracle's Chronicle, the echoes of past futures.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-md text-foreground/90 mb-5 font-serif leading-relaxed">
            Clearing the Oracle's Chronicle will erase all recorded divinations, queries, symbolic seeds, and chrono-symbolic moments. This act is as irreversible as a forgotten dream or a whisper lost to the winds of time. Proceed with caution, seeker.
          </p>
        </CardContent>
        <CardFooter className="p-5 bg-secondary/40 border-t-2 border-primary/30">
          <Button variant="destructive" onClick={handleClearJournal} className="font-lora text-md py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
            <Trash2 className="mr-2.5 h-5 w-5" />
            Cleanse the Chronicle
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/50 p-6 border-b-2 border-primary/40">
          <CardTitle className="text-2xl flex items-center gap-3 font-lora text-primary tracking-wider">
            <Info className="h-7 w-7 text-accent animate-pulse-glow" />
            Secrets of the FutureFlow Oracle
          </CardTitle>
           <CardDescription className="font-serif italic text-muted-foreground text-md">
            Peer into the construction and essence of this divinatory engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-md text-foreground/90 p-6 font-serif leading-relaxed">
          <p><strong className="text-primary/90">Oracle Version:</strong> {appVersion || "Calculating..."}</p>
          <p><strong className="text-primary/90">Last Ætheric Calibration:</strong> {lastCalibration || "Aligning cosmic gears..."}</p>
          <p>
            <strong className="text-primary/90">Thematic Aura:</strong> FutureFlow is enveloped in a deep cosmic, antique mystery to enhance your divinatory journey. The dark, ornate interface is a core feature of this immersive experience, a window into a bygone era of mechanical marvels and mysticism.
          </p>
           <p>
            <strong className="text-primary/90">Symbolic Seeds of Inspiration:</strong> <Sparkles className="inline h-5 w-5 text-accent/80 mb-1 animate-pulse-glow"/> These evocative phrases are whispered to AstraKairos to spark its deeper intuition. A random seed is chosen for your first seeking, and you may choose to let it evolve based on a reading's essence, creating a unique lineage of inspiration for your future divinations.
          </p>
          <p>
            <strong className="text-primary/90">Caveats & Disclaimers:</strong> For a deeper understanding of the nature and limitations of the visions provided by AstraKairos, please consult the disclaimers section on the "Peer into Fate" (AI Divination) page. FutureFlow is intended for personal reflection and entertainment, a dance with symbols and possibilities in the grand theatre of fate.
          </p>
        </CardContent>
         <CardFooter className="p-5 bg-secondary/40 border-t-2 border-primary/30">
            <p className="text-xs text-muted-foreground/70 italic font-serif">FutureFlow Oracle &copy; {new Date().getFullYear()}. All rights reserved in this realm and others glimpsed.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
