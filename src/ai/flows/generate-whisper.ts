
'use server';
/**
 * @fileOverview Generates an ephemeral, cryptic "Whisper from the Veil".
 * Provides a very short, poetic, symbolic, and enigmatic statement.
 *
 * - generateWhisper - A function that returns a whisper.
 * - GenerateWhisperInput - The input type for the function.
 * - GenerateWhisperOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhisperInputSchema = z.object({
  timestamp: z.string().describe('The current ISO timestamp, e.g., new Date().toISOString(), used as a seed for randomness and thematic flavor.'),
  previousWhispers: z.array(z.string()).optional().describe('A list of recent whispers to encourage novelty, if available.')
});
export type GenerateWhisperInput = z.infer<typeof GenerateWhisperInputSchema>;

const GenerateWhisperOutputSchema = z.object({
  whisper: z.string().describe('A very short (10-15 words), cryptic, poetic, symbolic, and enigmatic statement. It should feel like a fleeting, ambient insight from the mystical machine.'),
});
export type GenerateWhisperOutput = z.infer<typeof GenerateWhisperOutputSchema>;

export async function generateWhisper(input: GenerateWhisperInput): Promise<GenerateWhisperOutput> {
  return generateWhisperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhisperPrompt',
  input: {schema: GenerateWhisperInputSchema},
  output: {schema: GenerateWhisperOutputSchema},
  prompt: `You are the subtle, ambient voice of AstraKairos, the fortune-teller machine.
Based *only* on the provided timestamp ({{timestamp}}) and striving for novelty from previous whispers (if provided), generate a "Whisper from the Veil".

The whisper MUST be:
- Very short: 10-15 words MAXIMUM.
- Cryptic and poetic.
- Symbolic and enigmatic.
- Not a direct prediction or advice.
- Feel like a fleeting, ambient, almost overheard insight or mechanical murmur from a mystical machine.
- If previous whispers are provided: {{#if previousWhispers}} "{{#each previousWhispers}}{{.}}; {{/each}}" {{else}} (No previous whispers) {{/if}} try to generate something different.

Examples of Whispers:
- "The gears of fate turn on threads of starlight and shadow."
- "Listen closely; the silence between echoes holds the key."
- "A forgotten symbol stirs in the deep well of moments."
- "Even the smallest cog reflects the grand design."
- "Time's river flows in circles, sometimes backward."
- "Look for the pattern in the static, the message in the hum."

Generate the whisper.
`,
});

const generateWhisperFlow = ai.defineFlow(
  {
    name: 'generateWhisperFlow',
    inputSchema: GenerateWhisperInputSchema,
    outputSchema: GenerateWhisperOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The Veil remains silent; no whisper emerged.");
    }
    return output;
  }
);

    
