
'use server';
/**
 * @fileOverview Analyzes two past divination entries to find karmic echoes or connections.
 *
 * - linkKarmicEchoes - A function that returns the analysis.
 * - LinkKarmicEchoesInput - The input type for the function.
 * - LinkKarmicEchoesOutput - The return type for the function.
 * - SimplifiedPredictionData - The type for a simplified prediction entry.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Prediction type is used by the adapter function which is now moved.
// We only need the type for the function signature of the flow if it were to take Prediction directly,
// but it takes SimplifiedPredictionData via LinkKarmicEchoesInput.

// We define a simplified schema for what the AI needs.
const SimplifiedPredictionSchema = z.object({
  query: z.string(),
  prediction: z.string(), // This is the journalSummaryForUser typically
  date: z.string(),
});
export type SimplifiedPredictionData = z.infer<typeof SimplifiedPredictionSchema>;

const LinkKarmicEchoesInputSchema = z.object({
  reading1: SimplifiedPredictionSchema.describe("The first divination reading entry."),
  reading2: SimplifiedPredictionSchema.describe("The second divination reading entry."),
});
export type LinkKarmicEchoesInput = z.infer<typeof LinkKarmicEchoesInputSchema>;

const LinkKarmicEchoesOutputSchema = z.object({
  karmicLinkAnalysis: z.string().describe('A concise analysis identifying karmic echoes, symbolic connections, repeating archetypes, or evolving narrative threads between the two provided readings.'),
});
export type LinkKarmicEchoesOutput = z.infer<typeof LinkKarmicEchoesOutputSchema>;

// The adaptPredictionForKarmicLink function has been moved to src/lib/adapters.ts

export async function linkKarmicEchoes(input: LinkKarmicEchoesInput): Promise<LinkKarmicEchoesOutput> {
  return linkKarmicEchoesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkKarmicEchoesPrompt',
  input: {schema: LinkKarmicEchoesInputSchema},
  output: {schema: LinkKarmicEchoesOutputSchema},
  prompt: `You are an insightful analyst of divinatory patterns and symbolic narratives.
Your task is to compare two past divination readings and identify profound connections between them.

Reading 1 (from {{reading1.date}}):
Query: "{{reading1.query}}"
AstraKairos's Insight: "{{reading1.prediction}}"

Reading 2 (from {{reading2.date}}):
Query: "{{reading2.query}}"
AstraKairos's Insight: "{{reading2.prediction}}"

Analyze these two readings. Identify and explain:
- Karmic echoes: Are there recurring challenges, lessons, or patterns that seem to carry over?
- Symbolic connections: Do specific symbols, images, or metaphors appear in both, or evolve from one to the other?
- Repeating archetypes: Are similar archetypal figures or situations present?
- Evolving narrative threads: Does the second reading seem to build upon, resolve, or contrast with the first in a meaningful way?

Provide a concise yet insightful analysis focusing on these connections.
`,
});

const linkKarmicEchoesFlow = ai.defineFlow(
  {
    name: 'linkKarmicEchoesFlow',
    inputSchema: LinkKarmicEchoesInputSchema,
    outputSchema: LinkKarmicEchoesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to link karmic echoes between readings.");
    }
    return output;
  }
);

    