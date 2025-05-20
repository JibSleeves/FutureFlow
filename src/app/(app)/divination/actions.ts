
"use server";

import { generateInsights, GenerateInsightsInput, AstraKairosInsight } from '@/ai/flows/generate-insights';

export async function handleGenerateInsightsAction(input: GenerateInsightsInput): Promise<AstraKairosInsight | { error: string }> {
  try {
    const result = await generateInsights(input);
    return result;
  } catch (e: any) {
    console.error("Error generating insights with AstraKairos:", e);
    return { error: e.message || "Failed to generate insights with AstraKairos." };
  }
}
