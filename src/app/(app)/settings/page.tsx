
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJournal } from '@/contexts/journal-context';
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, BookUser, Info, Trash2 } from "lucide-react"; // Using SettingsIcon alias

export default function SettingsPage() {
  const { clearJournal } = useJournal();
  const { toast } = useToast();

  const handleClearJournal = () => {
    clearJournal();
    toast({
      title: "Journal Cleared",
      description: "All your past divinations and journal entries have been removed.",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <SettingsIcon className="h-10 w-10 text-accent" /> Settings
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your FutureFlow application settings and preferences.
        </p>
      </header>

      <Card className="shadow-lg bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookUser className="h-5 w-5 text-primary" />
            Journal Management
          </CardTitle>
          <CardDescription>
            Manage data related to your Future Journal entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Clearing your journal will remove all saved divination insights, queries, symbolic seeds used, and chrono-symbolic moments. This action cannot be undone.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleClearJournal}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Journal Entries
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-lg bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            About FutureFlow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p><span className="font-semibold">App Version:</span> 1.0.0 (Cosmic Alpha)</p>
          <p>
            <span className="font-semibold">Theme:</span> FutureFlow embraces a deep cosmic theme to enhance the mystical experience. The dark palette is an integral part of this atmosphere and is not currently configurable.
          </p>
           <p>
            <span className="font-semibold">Symbolic Seeds:</span> These evocative phrases are used to spark AstraKairos's intuition. A random seed is chosen for your first divination, and you have the option to evolve it based on your reading's essence, creating a unique lineage of inspiration for subsequent divinations.
          </p>
          <p>
            <span className="font-semibold">Disclaimers:</span> For information on the nature and limitations of the insights provided by AstraKairos, please refer to the disclaimers section on the AI Divination page. FutureFlow is intended for personal reflection and entertainment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
