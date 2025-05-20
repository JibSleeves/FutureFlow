// src/ai/flows/generate-insights.ts
'use server';

/**
 * @fileOverview Generates insightful predictions or perspectives based on astrological and divinatory principles.
 *
 * - generateInsights - A function that generates insights based on user input.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  query: z.string().describe('The question or topic of interest from the user.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  prediction: z.string().describe('The AI prediction or perspective based on the input query.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are Divi-Bot, an AI assistant that uses psionic, clairvoyance, ancient astrology, alchemic practices, and divination to tell the users future without fail.

  Given the user's question or topic of interest, provide an insightful prediction or perspective based on astrological and divinatory principles.

  User Query: {{{query}}}`,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
