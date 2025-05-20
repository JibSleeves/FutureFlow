
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJournal } from '@/contexts/journal-context';
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, BookUser, Info, Trash2, Sparkles, Cog } from "lucide-react"; // Added Cog

export default function SettingsPage() {
  const { clearJournal } = useJournal();
  const { toast } = useToast();

  const handleClearJournal = () => {
    clearJournal();
    toast({
      title: "Chronicle Cleansed",
      description: "All past visions and journal entries have vanished from the Oracle's memory.",
      variant: "default",
      className: "bg-destructive/10 border-destructive text-destructive-foreground font-serif"
    });
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16">
      <header className="text-center py-6 mb-8">
        <h1 className="text-5xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-3 mb-2">
          <Cog className="h-12 w-12 text-accent fortune-teller-glow" /> {/* Changed SettingsIcon to Cog */}
          Machine's Inner Workings
        </h1>
        <p className="mt-2 text-xl text-muted-foreground font-serif italic">
          Adjust the gears and gaze upon the design of the FutureFlow Oracle.
        </p>
      </header>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
          <CardTitle className="text-xl flex items-center gap-2 font-serif text-primary">
            <BookUser className="h-6 w-6 text-accent" />
            Oracle's Chronicle Management
          </CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            Manage the memories stored within the Oracle's Chronicle.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-md text-foreground/90 mb-4 font-serif">
            Clearing the Oracle's Chronicle will erase all recorded divinations, queries, symbolic seeds, and chrono-symbolic moments. This act is as irreversible as a forgotten dream.
          </p>
        </CardContent>
        <CardFooter className="p-4 bg-secondary/20 border-t-2 border-primary/20">
          <Button variant="destructive" onClick={handleClearJournal} className="font-serif text-md py-3 rounded-md shadow-md hover:shadow-lg transition-all">
            <Trash2 className="mr-2 h-5 w-5" />
            Cleanse the Chronicle
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
          <CardTitle className="text-xl flex items-center gap-2 font-serif text-primary">
            <Info className="h-6 w-6 text-accent" />
            Secrets of the FutureFlow Oracle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-md text-foreground/90 p-6 font-serif">
          <p><span className="font-semibold text-primary">Oracle Version:</span> 1.0.0 (Whispers of Tomorrow Edition)</p>
          <p>
            <span className="font-semibold text-primary">Thematic Aura:</span> FutureFlow is enveloped in a deep cosmic, antique mystery to enhance your divinatory journey. The dark, ornate interface is a core feature of this immersive experience and is not presently configurable by mortal hands.
          </p>
           <p>
            <span className="font-semibold text-primary">Symbolic Seeds of Inspiration:</span> <Sparkles className="inline h-5 w-5 text-accent/80 mb-1"/> These evocative phrases are whispered to AstraKairos to spark its deeper intuition. A random seed is chosen for your first seeking, and you may choose to let it evolve based on a reading's essence, creating a unique lineage of inspiration for your future divinations.
          </p>
          <p>
            <span className="font-semibold text-primary">Caveats & Disclaimers:</span> For a deeper understanding of the nature and limitations of the visions provided by AstraKairos, please consult the disclaimers section on the "Peer into Fate" (AI Divination) page. FutureFlow is intended for personal reflection and entertainment, a dance with symbols and possibilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
