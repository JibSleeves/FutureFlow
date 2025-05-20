
'use server';
/**
 * @fileOverview Generates an ephemeral 'Astral Weather Briefing'.
 * Provides a short, poetic, symbolic statement about the current cosmic energies
 * based purely on the provided timestamp, intended to set a mystical mood.
 *
 * - getAstralWeather - A function that returns the astral weather briefing.
 * - GetAstralWeatherInput - The input type for the function.
 * - GetAstralWeatherOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAstralWeatherInputSchema = z.object({
  currentTimestamp: z.string().describe('The current ISO timestamp, e.g., new Date().toISOString()'),
});
export type GetAstralWeatherInput = z.infer<typeof GetAstralWeatherInputSchema>;

const GetAstralWeatherOutputSchema = z.object({
  astralBriefing: z.string().describe('A 1-2 sentence poetic and symbolic "Astral Weather Briefing" reflecting the general energetic signature of the provided timestamp. This is not a personal prediction.'),
});
export type GetAstralWeatherOutput = z.infer<typeof GetAstralWeatherOutputSchema>;

export async function getAstralWeather(input: GetAstralWeatherInput): Promise<GetAstralWeatherOutput> {
  return getAstralWeatherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAstralWeatherPrompt',
  input: {schema: GetAstralWeatherInputSchema},
  output: {schema: GetAstralWeatherOutputSchema},
  prompt: `You are an oracle sensing the subtle, ambient energies of the current moment in time.
Based *only* on the provided timestamp: {{currentTimestamp}}.

Generate a 1-2 sentence poetic and highly symbolic 'Astral Weather Briefing'.
This briefing should reflect the general energetic signature of this specific moment.
It is NOT a personal prediction for any user. It is a mystical, atmospheric observation.
Focus on imagery and subtle feelings.

Examples:
- "The celestial currents whisper of introspection today, as a hidden moon lends its silvery light to inner worlds."
- "A quickening pulse in the ether; new beginnings stir beneath a veneer of calm."
- "Winds of change brush the veil; expect fleeting glimpses of what lies beyond the known."
- "Deep wells of ancient wisdom reflect the starlight of this hour; a time for quiet contemplation."
`,
});

const getAstralWeatherFlow = ai.defineFlow(
  {
    name: 'getAstralWeatherFlow',
    inputSchema: GetAstralWeatherInputSchema,
    outputSchema: GetAstralWeatherOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to perceive the Astral Weather.");
    }
    return output;
  }
);

    