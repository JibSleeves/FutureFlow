
'use server';
/**
 * @fileOverview Determines AstraKairos's "Daily Symbolic Focus".
 * Provides a single keyword or very short phrase representing a thematic
 * flavor for the day, based on the provided date.
 *
 * - getDailySymbolicFocus - A function that returns the daily focus.
 * - GetDailySymbolicFocusInput - The input type for the function.
 * - GetDailySymbolicFocusOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetDailySymbolicFocusInputSchema = z.object({
  currentDateString: z.string().describe('The current date as a string (e.g., YYYY-MM-DD), used as a seed for the symbolic focus.'),
});
export type GetDailySymbolicFocusInput = z.infer<typeof GetDailySymbolicFocusInputSchema>;

const GetDailySymbolicFocusOutputSchema = z.object({
  dailyFocus: z.string().describe('A single keyword or very short (2-3 words) symbolic phrase representing the thematic focus for the provided date. Examples: "Transformation", "Hidden Paths", "Ancient Wisdom", "Cosmic Echoes", "Inner Alchemy".'),
});
export type GetDailySymbolicFocusOutput = z.infer<typeof GetDailySymbolicFocusOutputSchema>;

export async function getDailySymbolicFocus(input: GetDailySymbolicFocusInput): Promise<GetDailySymbolicFocusOutput> {
  return getDailySymbolicFocusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDailySymbolicFocusPrompt',
  input: {schema: GetDailySymbolicFocusInputSchema},
  output: {schema: GetDailySymbolicFocusOutputSchema},
  prompt: `You are AstraKairos, an oracle that perceives the subtle symbolic currents of time.
Based *only* on the provided date: {{currentDateString}}.

Determine and state the "Daily Symbolic Focus" for this day.
This focus should be:
- A single keyword or a very short phrase (2-3 words maximum).
- Evocative and thematically rich, suitable for contemplation.
- Not a prediction, but an ambient symbolic flavor for the day.

Examples:
- "Revelation"
- "Inner Compass"
- "Woven Threads"
- "Silent Growth"
- "Cyclical Rhythms"
- "Quantum Leap"
- "Ancestral Echoes"
- "The Unseen Path"

Generate the dailyFocus.
`,
});

const getDailySymbolicFocusFlow = ai.defineFlow(
  {
    name: 'getDailySymbolicFocusFlow',
    inputSchema: GetDailySymbolicFocusInputSchema,
    outputSchema: GetDailySymbolicFocusOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to perceive the Daily Symbolic Focus.");
    }
    return output;
  }
);

    
