
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
import { Palette, Wand2, Sparkles, Sun, Moon, Star, Atom, Edit3, Feather, Shapes, Info, Puzzle, AlignCenter, AudioLines, Sprout } from "lucide-react"; 
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Separator } from '@/components/ui/separator';
import type { GenerateSigilOutput, GenerateSigilInput } from '@/ai/flows/generate-sigil';
import { handleGenerateSigilAction } from './actions';
import { cn } from '@/lib/utils';

const astrologicalTypes = [
  { value: "Solar Empowerment Sigil", label: "Solar Sigil of Empowerment", icon: <Sun className="h-5 w-5 mr-2.5 text-yellow-400 animate-pulse-glow" /> },
  { value: "Lunar Intuition Glyph", label: "Lunar Glyph of Intuition", icon: <Moon className="h-5 w-5 mr-2.5 text-blue-300 animate-pulse-glow" /> },
  { value: "Stellar Destiny Mark", label: "Stellar Mark of Destiny", icon: <Star className="h-5 w-5 mr-2.5 text-purple-400 animate-pulse-glow" /> },
  { value: "Planetary Harmony Cipher", label: "Planetary Cipher of Harmony", icon: <Atom className="h-5 w-5 mr-2.5 text-green-400 animate-pulse-glow" /> },
  { value: "Elemental Core Brand", label: "Elemental Brand of Core Power", icon: <Sprout className="h-5 w-5 mr-2.5 text-red-400 animate-pulse-glow" /> }, // Changed Sparkles to Sprout for elemental
];

const runicTypes = [
  { value: "Ancient Line Bindrune", label: "Ancient Bindrune of Lines", icon: <AlignCenter className="h-5 w-5 mr-2.5 text-orange-400 animate-pulse-glow" /> },
  { value: "Mystical Script Seal", label: "Mystic Seal of Scripts", icon: <Feather className="h-5 w-5 mr-2.5 text-teal-300 animate-pulse-glow" /> },
  { value: "Abstract Energy Glyph", label: "Abstract Glyph of Energy", icon: <Shapes className="h-5 w-5 mr-2.5 text-indigo-400 animate-pulse-glow" /> },
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
      toast({ variant: "destructive", title: "Intention Unclear", description: "Whisper your desire for the sigil's heart, O Weaver of Symbols." });
      return;
    }
    if (!sigilSystem) {
      toast({ variant: "destructive", title: "System Unchosen", description: "Select the symbolic path: Astrological Stars or Runic Staves." });
      return;
    }
    if (!specificType) {
      toast({ variant: "destructive", title: "Form Undefined", description: "Choose the sigil's specific archetype or style from the æther." });
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
        toast({ title: "AstraKairos Unveils Your Sigil!", description: "The symbol's essence takes form, etched in light.", className: "bg-primary/20 border-primary/50 text-primary-foreground shadow-ornate" });
      }
    });
  };

  const currentTypes = sigilSystem === 'astrological' ? astrologicalTypes : sigilSystem === 'runic' ? runicTypes : [];

  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-16"> {/* Increased max-width */}
      <header className="text-center py-8">
        <h1 className="text-5xl md:text-6xl font-lora font-bold tracking-wider text-primary flex items-center justify-center gap-4 mb-3">
          <Palette className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" /> Symbol Weaver <Palette className="h-10 w-10 md:h-12 md:w-12 text-accent animate-pulse-glow" />
        </h1>
        <p className="mt-2 text-xl md:text-2xl text-muted-foreground font-serif italic text-flicker">
          Conjure a unique sigil with AstraKairos, imbued with your will and the ancient symbolic resonance of the cosmos.
        </p>
      </header>

      <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/50 p-5 border-b-2 border-primary/40">
          <CardTitle className="text-2xl font-lora text-primary tracking-wider">Define Your Sigil's Sacred Core</CardTitle>
          <CardDescription className="font-serif italic text-muted-foreground">
            Channel your intention and choose the symbolic weave to guide AstraKairos in its mystic craft.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="intention" className="text-lg font-lora text-primary/90 flex items-center gap-2 tracking-wide"><Puzzle className="h-5 w-5 text-accent/90" />Your Intention, Purpose, or Desire:</Label>
            <Textarea
              id="intention"
              placeholder="E.g., For serene dreams under moonlit skies, to unlock hidden paths of wisdom, for a shield of unwavering light..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              rows={3}
              className="text-lg bg-input/80 focus:bg-input mt-2 p-3 rounded-lg border-2 border-primary/30 focus:border-accent shadow-inner-deep focus:ring-2 focus:ring-ring/50"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sigil-system" className="text-lg font-lora text-primary/90 tracking-wide">Choose Symbolic System:</Label>
              <Select
                value={sigilSystem}
                onValueChange={(value) => {
                  setSigilSystem(value as "astrological" | "runic" | "");
                  setSpecificType('');
                  setGeneratedSigil(null);
                }}
                disabled={isPending}
              >
                <SelectTrigger id="sigil-system" className="w-full mt-1 bg-input/80 focus:bg-input text-md p-3 rounded-lg border-2 border-primary/30 focus:border-accent shadow-inner-deep h-12">
                  <SelectValue placeholder="Select a Symbolic System" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-primary/40 shadow-xl rounded-lg font-lora">
                  <SelectItem value="astrological" className="text-md p-3 hover:bg-primary/20 cursor-pointer rounded-md">
                    <div className="flex items-center"><Sparkles className="h-5 w-5 mr-2.5 text-accent animate-pulse-glow" />Astrological Signs & Glyphs</div>
                  </SelectItem>
                  <SelectItem value="runic" className="text-md p-3 hover:bg-primary/20 cursor-pointer rounded-md">
                    <div className="flex items-center"><Edit3 className="h-5 w-5 mr-2.5 text-primary animate-pulse-glow" />Runic Staves & Bindrunes</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sigilSystem && (
              <div>
                <Label htmlFor="specific-type" className="text-lg font-lora text-primary/90 tracking-wide">
                  Select {sigilSystem === 'astrological' ? 'Astrological Archetype' : 'Runic Style'}:
                </Label>
                <Select
                  value={specificType}
                  onValueChange={setSpecificType}
                  disabled={isPending || !sigilSystem}
                >
                  <SelectTrigger id="specific-type" className="w-full mt-1 bg-input/80 focus:bg-input text-md p-3 rounded-lg border-2 border-primary/30 focus:border-accent shadow-inner-deep h-12">
                    <SelectValue placeholder={`Select ${sigilSystem === 'astrological' ? 'Archetype' : 'Style'}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-primary/40 shadow-xl rounded-lg font-lora">
                    {currentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-md p-3 hover:bg-primary/20 cursor-pointer rounded-md">
                        <div className="flex items-center">{type.icon}{type.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xl py-6 rounded-xl shadow-ornate hover:shadow-accent/40 transform hover:scale-[1.03] transition-all duration-200 font-lora tracking-wider" disabled={isPending || !sigilSystem || !specificType || !intention}>
            {isPending ? <LoadingSpinner className="mr-2.5" /> : <Wand2 className="mr-2.5 h-6 w-6" />}
            Conjure Sigil with AstraKairos
          </Button>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <LoadingSpinner size="lg" className="text-accent animate-pulse-glow" />
          <p className="text-2xl text-primary animate-pulse font-lora tracking-wider">AstraKairos weaves the sacred symbols from ætheric threads...</p>
        </div>
      )}

      {error && !isPending && (
        <Alert variant="destructive" className="shadow-ornate border-2 border-destructive/60 rounded-xl bg-destructive/20 fortune-teller-glass-display p-5">
          <Wand2 className="h-6 w-6 text-destructive/80" />
          <AlertTitle className="font-lora text-xl text-destructive-foreground/90">Conjuring Interrupted by Shadow</AlertTitle>
          <AlertDescription className="font-serif text-destructive-foreground/80">{error}</AlertDescription>
        </Alert>
      )}

      {generatedSigil && !isPending && (
        <Card className="shadow-ornate bg-card/70 backdrop-blur-md border-2 border-primary/30 rounded-xl overflow-hidden animate-in fade-in duration-700">
          <CardHeader className="bg-secondary/50 p-5 border-b-2 border-primary/40">
            <CardTitle className="text-3xl text-primary font-lora flex items-center gap-3 tracking-wider">
              <Sparkles className="h-8 w-8 text-accent animate-pulse-glow" /> {generatedSigil.sigilName}
            </CardTitle>
            <CardDescription className="font-serif italic text-muted-foreground text-md">AstraKairos has manifested a sigil for your sacred intention, drawn from the symbolic wellspring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-xl font-semibold text-accent mb-2 font-lora flex items-center gap-2 tracking-wide"><AudioLines className="h-6 w-6" />Harmonic Attunement Phrase:</h3>
              <p className="text-lg italic leading-relaxed whitespace-pre-wrap font-serif text-accent-foreground/90 text-center py-3 bg-accent/20 rounded-lg shadow-inner-deep border border-accent/30 text-flicker">"{generatedSigil.harmonicAttunementPhrase}"</p>
            </div>
            <Separator className="bg-primary/30" />
            <div>
              <h3 className="text-xl font-semibold text-primary/90 mb-2 font-lora tracking-wide">Visual Invocation (Description):</h3>
              <p className="text-md leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">{generatedSigil.description}</p>
            </div>
            <Separator className="bg-primary/30" />
            <div className="aspect-square w-full max-w-md mx-auto overflow-hidden rounded-xl border-2 border-primary/40 shadow-inner-deep bg-background/60 flex items-center justify-center relative my-4 group">
              <Image
                src="https://placehold.co/400x400.png"
                alt="Sigil Visualization Placeholder"
                width={400}
                height={400}
                className="object-cover w-full h-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                data-ai-hint={`mystical sigil ${generatedSigil.visualizationSeed} ornate intricate ${sigilSystem === "astrological" ? "celestial" : "runic ancient"} symbol`}
              />
              <Wand2 className="absolute h-24 w-24 text-accent/40 animate-pulse-glow opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
               {/* Pixel art hint example: data-ai-hint={`pixel art sigil ${generatedSigil.visualizationSeed} 8-bit symbol`} */}
            </div>
            <p className="text-center text-sm text-muted-foreground font-serif italic">AI Visualization Seed: "<span className="font-semibold text-flicker">{generatedSigil.visualizationSeed}</span>"</p>
            <Separator className="bg-primary/30" />
            <div>
              <h3 className="text-xl font-semibold text-primary/90 mb-2 font-lora tracking-wide">Symbolic Resonance & Meaning:</h3>
              <p className="text-md leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">{generatedSigil.symbolism}</p>
            </div>
            <Separator className="bg-primary/30" />
            <div>
              <h3 className="text-xl font-semibold text-primary/90 mb-2 font-lora tracking-wide">Suggested Invocation & Use:</h3>
              <p className="text-md leading-relaxed whitespace-pre-wrap font-serif text-foreground/90">{generatedSigil.usageSuggestion}</p>
            </div>
          </CardContent>
          <CardFooter className="p-5 bg-secondary/30 border-t-2 border-primary/30">
            <Alert className="bg-card/50 border-primary/20 shadow-sm w-full">
              <Info className="h-5 w-5 text-accent" />
              <AlertTitle className="font-lora text-primary text-lg">For Your Contemplation & Craft</AlertTitle>
              <AlertDescription className="font-serif text-muted-foreground/90">
                This sigil is a symbolic conduit crafted by AstraKairos. Meditate upon its form, its heart, and its harmonic phrase.
                The vision above is but a whisper of its potential; use the description and visualization seed to bring it fully to life in your mind's eye, through your own art, or as a focus for your will.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
