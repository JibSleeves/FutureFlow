
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
  currentTimestamp: z.string().describe('The current ISO timestamp, e.g., new Date().toISOString(), used as a primary seed for the energetic reading.'),
});
export type GetAstralWeatherInput = z.infer<typeof GetAstralWeatherInputSchema>;

const GetAstralWeatherOutputSchema = z.object({
  astralBriefing: z.string().describe('A 1-2 sentence poetic and highly symbolic "Astral Weather Briefing" reflecting the general energetic signature of the provided timestamp. This is not a personal prediction, but an atmospheric reading from the Oracle\'s senses.'),
});
export type GetAstralWeatherOutput = z.infer<typeof GetAstralWeatherOutputSchema>;

export async function getAstralWeather(input: GetAstralWeatherInput): Promise<GetAstralWeatherOutput> {
  return getAstralWeatherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAstralWeatherPrompt',
  input: {schema: GetAstralWeatherInputSchema},
  output: {schema: GetAstralWeatherOutputSchema},
  prompt: `You are AstraKairos, an oracle with senses attuned to the subtle, ambient energies of the current moment in time.
Based *only* on the provided timestamp: {{currentTimestamp}}.

Generate a 1-2 sentence poetic and highly symbolic 'Astral Weather Briefing'.
This briefing should reflect the general energetic signature of this specific moment, as if reading from an ætheric barometer.
It is NOT a personal prediction for any user. It is a mystical, atmospheric observation, full of rich imagery.
Focus on imagery related to light, shadow, celestial bodies, elements, or subtle feelings in the æther.

Examples:
- "The celestial currents whisper of introspection today, as a hidden moon lends its silvery light to inner worlds, painting shadows with truth."
- "A quickening pulse in the æther; new beginnings stir beneath a veneer of calm, like magma beneath ancient stone."
- "Winds of change brush the velvet veil of reality; expect fleeting glimpses of what lies beyond the known, shimmering at the edge of sight."
- "Deep wells of ancient wisdom reflect the starlight of this hour, cool and profound; a time for quiet contemplation and the unearthing of forgotten lore."
- "Sparks of innovation dance on the solar winds; cosmic inspiration flows freely for those attuned to its vibrant song."
- "A gentle rain of cosmic dust settles, nurturing seeds of intuition. The air is thick with unspoken potential."
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
      throw new Error("Failed to perceive the Astral Weather; the ætheric currents are unusually turbulent.");
    }
    return output;
  }
);
