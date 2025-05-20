
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
import { Palette, Wand2, Sparkles, Sun, Moon, Star, Atom, Edit3, Feather, Shapes, Info, Puzzle, AlignCenter, AudioLines } from "lucide-react"; // Added Puzzle, AlignCenter, AudioLines
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import type { GenerateSigilOutput, GenerateSigilInput } from '@/ai/flows/generate-sigil';
import { handleGenerateSigilAction } from './actions';

const astrologicalTypes = [
  { value: "Solar Empowerment Sigil", label: "Solar Sigil of Empowerment", icon: <Sun className="h-5 w-5 mr-2 text-yellow-400" /> },
  { value: "Lunar Intuition Glyph", label: "Lunar Glyph of Intuition", icon: <Moon className="h-5 w-5 mr-2 text-blue-300" /> },
  { value: "Stellar Destiny Mark", label: "Stellar Mark of Destiny", icon: <Star className="h-5 w-5 mr-2 text-purple-400" /> },
  { value: "Planetary Harmony Cipher", label: "Planetary Cipher of Harmony", icon: <Atom className="h-5 w-5 mr-2 text-green-400" /> },
  { value: "Elemental Core Brand", label: "Elemental Brand of Core Power", icon: <Sparkles className="h-5 w-5 mr-2 text-red-400" /> },
];

const runicTypes = [
  { value: "Ancient Line Bindrune", label: "Ancient Bindrune of Lines", icon: <AlignCenter className="h-5 w-5 mr-2 text-orange-400" /> },
  { value: "Mystical Script Seal", label: "Mystic Seal of Scripts", icon: <Feather className="h-5 w-5 mr-2 text-teal-300" /> },
  { value: "Abstract Energy Glyph", label: "Abstract Glyph of Energy", icon: <Shapes className="h-5 w-5 mr-2 text-indigo-400" /> },
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
      toast({ variant: "destructive", title: "Intention Unclear", description: "Whisper your desire for the sigil's heart." });
      return;
    }
    if (!sigilSystem) {
      toast({ variant: "destructive", title: "System Unchosen", description: "Select the symbolic path: Astrological or Runic." });
      return;
    }
    if (!specificType) {
      toast({ variant: "destructive", title: "Form Undefined", description: "Choose the sigil's specific archetype or style." });
      return;
    }
    setError(null);
    setGeneratedSigil(null);

    startTransition(async () => {
      const input: GenerateSigilInput = {
        intention,
        sigilSystem: sigilSystem as "astrological" | "runic",
        specificType,
      };
      const result = await handleGenerateSigilAction(input);

      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "Sigil Weaving Falters", description: result.error });
      } else {
        setGeneratedSigil(result);
        toast({ title: "AstraKairos Unveils Your Sigil!", description: "The symbol's essence takes form.", className: "bg-primary/10 border-primary text-primary-foreground" });
      }
    });
  };

  const currentTypes = sigilSystem === 'astrological' ? astrologicalTypes : sigilSystem === 'runic' ? runicTypes : [];

  return (
    <div className="container mx-auto max-w-3xl space-y-8 pb-16">
      <header className="text-center py-6">
        <h1 className="text-5xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-3 mb-2">
          <Palette className="h-12 w-12 text-accent fortune-teller-glow" /> Symbol Weaver
        </h1>
        <p className="mt-2 text-xl text-muted-foreground font-serif italic">
          Conjure a unique sigil with AstraKairos, imbued with your will and symbolic resonance.
        </p>
      </header>

      <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
          <CardTitle className="text-2xl font-serif text-primary">Define Your Sigil's Core</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            Channel your intention and choose the symbolic weave to guide AstraKairos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="intention" className="text-lg font-serif text-primary/90 flex items-center gap-2"><Puzzle className="h-5 w-5 text-accent" />Your Intention or Purpose:</Label>
            <Textarea
              id="intention"
              placeholder="E.g., For serene dreams, to unlock hidden paths, for a shield of light..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              rows={3}
              className="text-lg bg-input/80 focus:bg-input mt-2 p-3 rounded-md border-2 border-primary/20 focus:border-accent shadow-inner"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sigil-system" className="text-lg font-serif text-primary/90">Symbolic System</Label>
              <Select
                value={sigilSystem}
                onValueChange={(value) => {
                  setSigilSystem(value as "astrological" | "runic" | "");
                  setSpecificType('');
                  setGeneratedSigil(null);
                }}
                disabled={isPending}
              >
                <SelectTrigger id="sigil-system" className="w-full mt-1 bg-input/80 focus:bg-input text-md p-3 rounded-md border-2 border-primary/20 focus:border-accent shadow-inner h-12">
                  <SelectValue placeholder="Select a Symbolic System" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-primary/30 shadow-lg rounded-md">
                  <SelectItem value="astrological" className="text-md p-3 hover:bg-primary/20 cursor-pointer">
                    <div className="flex items-center font-serif"><Sparkles className="h-5 w-5 mr-2 text-accent" />Astrological Signs</div>
                  </SelectItem>
                  <SelectItem value="runic" className="text-md p-3 hover:bg-primary/20 cursor-pointer">
                    <div className="flex items-center font-serif"><Edit3 className="h-5 w-5 mr-2 text-primary" />Runic Forms</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sigilSystem && (
              <div>
                <Label htmlFor="specific-type" className="text-lg font-serif text-primary/90">
                  {sigilSystem === 'astrological' ? 'Astrological Archetype' : 'Runic Style'}
                </Label>
                <Select
                  value={specificType}
                  onValueChange={setSpecificType}
                  disabled={isPending || !sigilSystem}
                >
                  <SelectTrigger id="specific-type" className="w-full mt-1 bg-input/80 focus:bg-input text-md p-3 rounded-md border-2 border-primary/20 focus:border-accent shadow-inner h-12">
                    <SelectValue placeholder={`Select ${sigilSystem === 'astrological' ? 'Archetype' : 'Style'}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-primary/30 shadow-lg rounded-md">
                    {currentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-md p-3 hover:bg-primary/20 cursor-pointer">
                        <div className="flex items-center font-serif">{type.icon}{type.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-serif" disabled={isPending || !sigilSystem || !specificType || !intention}>
            {isPending ? <LoadingSpinner className="mr-2" /> : <Wand2 className="mr-2 h-6 w-6" />}
            Conjure Sigil with AstraKairos
          </Button>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <LoadingSpinner size="lg" className="text-accent" />
          <p className="text-xl text-primary animate-pulse font-serif">AstraKairos weaves the sacred symbols...</p>
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-md border-2 border-destructive/50 rounded-lg bg-destructive/10">
          <Wand2 className="h-5 w-5 text-destructive" />
          <AlertTitle className="font-serif text-lg">Conjuring Interrupted</AlertTitle>
          <AlertDescription className="font-serif">{error}</AlertDescription>
        </Alert>
      )}

      {generatedSigil && !isPending && (
        <Card className="shadow-2xl bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/40 p-5 border-b-2 border-primary/30">
            <CardTitle className="text-2xl text-primary font-serif flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-accent animate-pulse" /> {generatedSigil.sigilName}
            </CardTitle>
            <CardDescription className="font-serif italic text-muted-foreground">AstraKairos has manifested a sigil for your sacred intention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1 font-serif flex items-center gap-2"><AudioLines className="h-5 w-5 text-accent" />Harmonic Attunement Phrase:</h3>
              <p className="text-md italic leading-relaxed whitespace-pre-wrap font-serif text-accent/90 text-center py-2 bg-primary/5 rounded-md shadow-inner">"{generatedSigil.harmonicAttunementPhrase}"</p>
            </div>
            <Separator className="bg-primary/20" />
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1 font-serif">Visual Invocation:</h3>
              <p className="text-md leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">{generatedSigil.description}</p>
            </div>
            <Separator className="bg-primary/20" />
            <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg border-2 border-primary/20 shadow-inner bg-background/50 flex items-center justify-center relative my-4">
              <Image
                src="https://placehold.co/300x300.png"
                alt="Sigil Visualization Placeholder"
                width={300}
                height={300}
                className="object-cover w-full h-full opacity-40"
                data-ai-hint={`mystical sigil ${generatedSigil.visualizationSeed} ornate`}
              />
              <Wand2 className="absolute h-20 w-20 text-accent/50 fortune-teller-glow opacity-60" />
            </div>
            <p className="text-center text-sm text-muted-foreground font-serif italic">AI Visualization Seed: "<span className="font-semibold">{generatedSigil.visualizationSeed}</span>"</p>
            <Separator className="bg-primary/20" />
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1 font-serif">Symbolic Resonance:</h3>
              <p className="text-md leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">{generatedSigil.symbolism}</p>
            </div>
            <Separator className="bg-primary/20" />
            <div>
              <h3 className="text-lg font-semibold text-primary/90 mb-1 font-serif">Suggested Invocation:</h3>
              <p className="text-md leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">{generatedSigil.usageSuggestion}</p>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-secondary/20 border-t-2 border-primary/20">
            <Alert className="bg-background/50 border-primary/20 shadow-sm">
              <Info className="h-5 w-5 text-accent" />
              <AlertTitle className="font-serif text-primary">For Your Contemplation</AlertTitle>
              <AlertDescription className="font-serif text-muted-foreground">
                This sigil is a symbolic conduit crafted by AstraKairos. Meditate upon its form, its heart, and its harmonic phrase.
                The vision above is but a whisper; use the description and visualization seed to bring it fully to life in your mind's eye or through your own art.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    
