
"use server";

import { summarizePredictions, SummarizePredictionsInput, SummarizePredictionsOutput } from '@/ai/flows/summarize-predictions';

export async function handleSummarizePredictionsAction(input: SummarizePredictionsInput): Promise<SummarizePredictionsOutput | { error: string }> {
  try {
    const result = await summarizePredictions(input);
    return result;
  } catch (e: any) {
    console.error("Error summarizing predictions:", e);
    return { error: e.message || "Failed to summarize predictions." };
  }
}
