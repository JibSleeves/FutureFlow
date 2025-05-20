
'use server';
/**
 * @fileOverview Evolves a symbolic seed based on a previous seed and a reading.
 * Generates a new, thematically related symbolic seed to carry forward
 * the inspirational thread for future divinations.
 *
 * - evolveSymbolicSeed - A function that returns a new symbolic seed.
 * - EvolveSymbolicSeedInput - The input type for the function.
 * - EvolveSymbolicSeedOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvolveSymbolicSeedInputSchema = z.object({
  currentSeed: z.string().describe('The symbolic seed that was used for the previous divination.'),
  lastReadingSummary: z.string().describe("A summary of the divination reading that was inspired by the 'currentSeed'."),
});
export type EvolveSymbolicSeedInput = z.infer<typeof EvolveSymbolicSeedInputSchema>;

const EvolveSymbolicSeedOutputSchema = z.object({
  evolvedSeed: z.string().describe('A new, evolved symbolic seed (a short, evocative phrase or image description).'),
});
export type EvolveSymbolicSeedOutput = z.infer<typeof EvolveSymbolicSeedOutputSchema>;

export async function evolveSymbolicSeed(input: EvolveSymbolicSeedInput): Promise<EvolveSymbolicSeedOutput> {
  return evolveSymbolicSeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evolveSymbolicSeedPrompt',
  input: {schema: EvolveSymbolicSeedInputSchema},
  output: {schema: EvolveSymbolicSeedOutputSchema},
  prompt: `You are a generator of mystic symbols and creative catalysts.
Your task is to evolve a symbolic seed.

Previous Symbolic Seed: "{{currentSeed}}"
Summary of the Divination Inspired by this Seed: "{{lastReadingSummary}}"

Based on these, generate a NEW, evolved symbolic seed.
This new seed should:
- Be a short, evocative phrase or image description (3-7 words).
- Feel like a natural thematic progression, a deepening, or a creative mutation of the original seed, informed by the reading it sparked.
- Maintain a mystical and inspiring quality.

Examples of evolution (Original -> Reading Insight -> Evolved):
- "Raven feather on snow" -> "Reading spoke of hidden truths" -> "Ink spills on a frozen lake"
- "Forgotten melody" -> "Reading about ancestral echoes" -> "Songline shimmering in desert heat"
- "Spiral staircase into mist" -> "Reading of choices and unknown paths" -> "Labyrinth key of moonlight"

Generate the evolvedSeed.
`,
});

const evolveSymbolicSeedFlow = ai.defineFlow(
  {
    name: 'evolveSymbolicSeedFlow',
    inputSchema: EvolveSymbolicSeedInputSchema,
    outputSchema: EvolveSymbolicSeedOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to evolve the symbolic seed.");
    }
    return output;
  }
);

    