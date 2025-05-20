
'use server';

/**
 * @fileOverview Summarizes previous user predictions to extract archetypal themes and symbolic signatures,
 * improving the context for future divinations by AstraKairos.
 *
 * - summarizePredictionsForAstraKairos - A function that handles the summarization.
 * - SummarizePredictionsInput - The input type for this function.
 * - SummarizePredictionsOutput - The return type, containing the archetypal summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePredictionsInputSchema = z.object({
  predictions: z
    .string()
    .describe('A string containing the user\'s previous predictions, typically formatted with dates, queries, and AstraKairos\'s responses.'),
});
export type SummarizePredictionsInput = z.infer<typeof SummarizePredictionsInputSchema>;

const SummarizePredictionsOutputSchema = z.object({
  archetypalSummary: z.string().describe('A concise summary distillation of the user\'s previous predictions, focusing on key archetypal themes, recurring symbols, elemental imbalances, energetic states, or notable astrological patterns observed across entries. This summary serves as a form of long-term memory context for AstraKairos.'),
});
export type SummarizePredictionsOutput = z.infer<typeof SummarizePredictionsOutputSchema>;

export async function summarizePredictionsForAstraKairos(input: SummarizePredictionsInput): Promise<SummarizePredictionsOutput> {
  return summarizePredictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePredictionsForAstraKairosPrompt',
  input: {schema: SummarizePredictionsInputSchema},
  output: {schema: SummarizePredictionsOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing and summarizing past divinatory journal entries to provide rich context for a divination AI called AstraKairos.
Your goal is to distill the provided predictions into an "archetypalSummary". This summary should highlight:
- Key archetypal themes that emerge across multiple entries.
- Recurring symbols, omens, or imagery.
- Any apparent elemental imbalances or dominant elemental signatures.
- Persistent energetic states or emotional patterns.
- Notable or recurring astrological patterns if mentioned or inferable.
- Evolving narratives or questions.

The summary should be concise yet potent, providing AstraKairos with a "long-term memory" snapshot.

Please analyze the following journal entries:
{{{predictions}}}

Generate the archetypalSummary based on this analysis.
  `,
});

const summarizePredictionsFlow = ai.defineFlow(
  {
    name: 'summarizePredictionsFlow',
    inputSchema: SummarizePredictionsInputSchema,
    outputSchema: SummarizePredictionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate archetypal summary for AstraKairos.");
    }
    return output;
  }
);

