'use server';
/**
 * @fileOverview Analyzes a single divination entry to find its symbolic polarity.
 *
 * - analyzeSymbolicPolarity - A function that returns the polarity analysis.
 * - AnalyzeSymbolicPolarityInput - The input type for the function.
 * - AnalyzeSymbolicPolarityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymbolicPolarityInputSchema = z.object({
  readingQuery: z.string().describe("The original query of the divination reading."),
  readingSummary: z.string().describe("The summarized insight or prediction from the divination reading."),
  readingDate: z.string().describe("The date of the original divination reading."),
});
export type AnalyzeSymbolicPolarityInput = z.infer<typeof AnalyzeSymbolicPolarityInputSchema>;

const AnalyzeSymbolicPolarityOutputSchema = z.object({
  polarityAnalysis: z.string().describe('A concise analysis identifying the symbolic polarity, counterpoint, or complementary theme to the provided reading. Offers a balanced perspective or highlights potential shadow aspects.'),
  originalTheme: z.string().describe('A brief statement of the original reading\'s core theme as identified by the AI.'),
});
export type AnalyzeSymbolicPolarityOutput = z.infer<typeof AnalyzeSymbolicPolarityOutputSchema>;

export async function analyzeSymbolicPolarity(input: AnalyzeSymbolicPolarityInput): Promise<AnalyzeSymbolicPolarityOutput> {
  return analyzeSymbolicPolarityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymbolicPolarityPrompt',
  input: {schema: AnalyzeSymbolicPolarityInputSchema},
  output: {schema: AnalyzeSymbolicPolarityOutputSchema},
  prompt: `You are AstraKairos, an oracle skilled in discerning the balance and dualities within mystic insights.
A user seeks to understand the symbolic polarity or complementary aspect of a past divination.

Original Divination Reading Details:
Date: {{readingDate}}
User's Query: "{{readingQuery}}"
Core Insight/Summary: "{{readingSummary}}"

Your tasks:
1.  Identify the core theme or central message of this original reading. Briefly state this as 'originalTheme'.
2.  Based on this core theme, generate a 'polarityAnalysis'. This analysis should describe its opposite, complementary theme, or a potential shadow aspect.
    It should offer a balanced perspective or highlight what might be needed to integrate the original insight more fully.
    The tone should be insightful and reflective.

Examples of Core Theme -> Polarity Analysis:
- Core Theme: "Embracing new beginnings and opportunities."
  Polarity Analysis: "The wisdom of endings and the necessity of closure often pave the way for true new beginnings. Consider what must be lovingly released to make space for the fresh energies you seek. This is the fertile void from which creation springs."
- Core Theme: "A call for introspection and turning inward."
  Polarity Analysis: "While the inner sanctum holds deep wisdom, the outer world calls for its expression. Reflect on how your inner realizations can be brought forth into action and shared, lest they remain beautiful but dormant seeds."
- Core Theme: "A warning about potential deception or illusion."
  PolarityAnalysis: "The presence of illusion often highlights a deep yearning for truth and clarity. This is a call to sharpen discernment, not through cynicism, but through cultivating a clear inner compass and trusting your authentic intuition."

Provide the 'originalTheme' and 'polarityAnalysis'.
`,
});

const analyzeSymbolicPolarityFlow = ai.defineFlow(
  {
    name: 'analyzeSymbolicPolarityFlow',
    inputSchema: AnalyzeSymbolicPolarityInputSchema,
    outputSchema: AnalyzeSymbolicPolarityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AstraKairos failed to analyze the symbolic polarity.");
    }
    return output;
  }
);