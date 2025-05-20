
"use server";

import { generateInsights, GenerateInsightsInput, GenerateInsightsOutput } from '@/ai/flows/generate-insights';

export async function handleGenerateInsightsAction(input: GenerateInsightsInput): Promise<GenerateInsightsOutput | { error: string }> {
  try {
    const result = await generateInsights(input);
    return result;
  } catch (e: any) {
    console.error("Error generating insights:", e);
    return { error: e.message || "Failed to generate insights." };
  }
}
