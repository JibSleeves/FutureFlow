'use server';

/**
 * @fileOverview Summarizes previous user predictions to improve the accuracy of future predictions.
 *
 * - summarizePredictions - A function that handles the summarization of previous predictions.
 * - SummarizePredictionsInput - The input type for the summarizePredictions function.
 * - SummarizePredictionsOutput - The return type for the summarizePredictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePredictionsInputSchema = z.object({
  predictions: z
    .string()
    .describe('A string containing the user\'s previous predictions.'),
});
export type SummarizePredictionsInput = z.infer<typeof SummarizePredictionsInputSchema>;

const SummarizePredictionsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s previous predictions.'),
});
export type SummarizePredictionsOutput = z.infer<typeof SummarizePredictionsOutputSchema>;

export async function summarizePredictions(input: SummarizePredictionsInput): Promise<SummarizePredictionsOutput> {
  return summarizePredictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePredictionsPrompt',
  input: {schema: SummarizePredictionsInputSchema},
  output: {schema: SummarizePredictionsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing previous user predictions to improve future predictions.

  Please summarize the following predictions:
  {{{predictions}}}
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
    return output!;
  }
);
