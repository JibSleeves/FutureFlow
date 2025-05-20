
"use client";

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Palette, Wand2, Sparkles, Sun, Moon, Star, Atom, Edit3, Feather, Shapes, Terminal, Info } from "lucide-react";
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import type { GenerateSigilOutput, GenerateSigilInput } from '@/ai/flows/generate-sigil';
import { handleGenerateSigilAction } from './actions';

const astrologicalTypes = [
  { value: "Solar Empowerment Sigil", label: "Solar Empowerment Sigil", icon: <Sun className="h-4 w-4 mr-2" /> },
  { value: "Lunar Intuition Glyph", label: "Lunar Intuition Glyph", icon: <Moon className="h-4 w-4 mr-2" /> },
  { value: "Stellar Destiny Mark", label: "Stellar Destiny Mark", icon: <Star className="h-4 w-4 mr-2" /> },
  { value: "Planetary Harmony Cipher", label: "Planetary Harmony Cipher", icon: <Atom className="h-4 w-4 mr-2" /> },
  { value: "Elemental Core Brand", label: "Elemental Core Brand", icon: <Sparkles className="h-4 w-4 mr-2" /> },
];

const runicTypes = [
  { value: "Ancient Line Bindrune", label: "Ancient Line Bindrune", icon: <Edit3 className="h-4 w-4 mr-2" /> },
  { value: "Mystical Script Seal", label: "Mystical Script Seal", icon: <Feather className="h-4 w-4 mr-2" /> },
  { value: "Abstract Energy Glyph", label: "Abstract Energy Glyph", icon: <Shapes className="h-4 w-4 mr-2" /> },
];

export default function SigilGeneratorPageClient() {
  const [intention, setIntention] = useState('');
  const [sigilSystem, setSigilSystem] = useState<"astrological" | "runic" | "">("");
  const [specificType, setSpecificType] = useState('');
  const [generatedSigil, setGeneratedSigil] = useState<GenerateSigilOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!intention.trim()) {
      toast({ variant: "destructive", title: "Missing Intention", description: "Please provide your intention for the sigil." });
      return;
    }
    if (!sigilSystem) {
      toast({ variant: "destructive", title: "Missing System", description: "Please select a sigil system (Astrological or Runic)." });
      return;
    }
    if (!specificType) {
      toast({ variant: "destructive", title: "Missing Type", description: "Please select a specific archetype or style." });
      return;
    }
    setError(null);
    setGeneratedSigil(null);

    startTransition(async () => {
      const input: GenerateSigilInput = {
        intention,
        sigilSystem: sigilSystem as "astrological" | "runic", // Already validated
        specificType,
      };
      const result = await handleGenerateSigilAction(input);

      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Sigil Generation Error", description: result.error });
      } else {
        setGeneratedSigil(result);
        toast({ title: "AstraKairos Has Crafted Your Sigil", description: "The symbolic essence is now revealed." });
      }
    });
  };

  const currentTypes = sigilSystem === 'astrological' ? astrologicalTypes : sigilSystem === 'runic' ? runicTypes : [];

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center justify-center gap-3">
          <Palette className="h-10 w-10 text-accent" /> Sigil Generator
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Craft a unique sigil with AstraKairos, infused with your intention and symbolic power.
        </p>
      </header>

      <Card className="shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Define Your Sigil's Essence</CardTitle>
          <CardDescription>
            Provide your core intention and choose the symbolic system to guide AstraKairos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="intention" className="text-base">Your Intention or Purpose</Label>
            <Textarea
              id="intention"
              placeholder="E.g., To attract creative inspiration, For protection during travel, To manifest abundance..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              rows={3}
              className="text-base bg-input/80 focus:bg-input mt-1"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sigil-system" className="text-base">Sigil System</Label>
              <Select
                value={sigilSystem}
                onValueChange={(value) => {
                  setSigilSystem(value as "astrological" | "runic" | "");
                  setSpecificType(''); // Reset specific type when system changes
                  setGeneratedSigil(null); // Clear previous result
                }}
                disabled={isPending}
              >
                <SelectTrigger id="sigil-system" className="w-full mt-1 bg-input/80 focus:bg-input">
                  <SelectValue placeholder="Select a symbolic system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="astrological">
                    <div className="flex items-center"><Sparkles className="h-4 w-4 mr-2 text-accent" />Astrological Signs</div>
                  </SelectItem>
                  <SelectItem value="runic">
                    <div className="flex items-center"><Edit3 className="h-4 w-4 mr-2 text-primary" />Runic Forms</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sigilSystem && (
              <div>
                <Label htmlFor="specific-type" className="text-base">
                  {sigilSystem === 'astrological' ? 'Astrological Archetype' : 'Runic Style'}
                </Label>
                <Select
                  value={specificType}
                  onValueChange={setSpecificType}
                  disabled={isPending || !sigilSystem}
                >
                  <SelectTrigger id="specific-type" className="w-full mt-1 bg-input/80 focus:bg-input">
                    <SelectValue placeholder={`Select a ${sigilSystem === 'astrological' ? 'archetype' : 'style'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {currentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">{type.icon}{type.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <Button onClick={handleSubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6" disabled={isPending || !sigilSystem || !specificType || !intention}>
            {isPending ? <LoadingSpinner className="mr-2" /> : <Wand2 className="mr-2 h-5 w-5" />}
            Generate Sigil with AstraKairos
          </Button>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-primary animate-pulse">AstraKairos is weaving the symbols...</p>
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Sigil Generation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedSigil && !isPending && (
        <Card className="shadow-xl bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" /> {generatedSigil.sigilName}
            </CardTitle>
            <CardDescription>AstraKairos has manifested a sigil for your intention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Visual Description:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{generatedSigil.description}</p>
            </div>
            <Separator />
             <div className="aspect-[1/1] w-full max-w-xs mx-auto overflow-hidden rounded-lg border border-border shadow-inner bg-background/50 flex items-center justify-center relative my-4">
                <Image
                  src="https://placehold.co/300x300.png" 
                  alt="Sigil Visualization Placeholder"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full opacity-70"
                  data-ai-hint={generatedSigil.visualizationSeed}
                />
                <Wand2 className="absolute h-16 w-16 text-accent/70 animate-pulse" /> 
              </div>
              <p className="text-center text-xs text-muted-foreground">AI Visualization Seed: "<span className="italic">{generatedSigil.visualizationSeed}</span>"</p>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Symbolism:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{generatedSigil.symbolism}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1">Usage Suggestion:</h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{generatedSigil.usageSuggestion}</p>
            </div>
          </CardContent>
           <CardFooter>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>For Your Contemplation</AlertTitle>
              <AlertDescription>
                This sigil is a symbolic representation crafted by AstraKairos. Meditate on its form and meaning.
                The visual is a placeholder; use the description and visualization seed to bring it to life in your mind's eye or through art.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
