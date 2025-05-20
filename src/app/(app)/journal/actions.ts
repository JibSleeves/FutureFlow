
"use server";

import { summarizePredictionsForAstraKairos, SummarizePredictionsInput, SummarizePredictionsOutput } from '@/ai/flows/summarize-predictions';

export async function handleSummarizePredictionsAction(input: SummarizePredictionsInput): Promise<SummarizePredictionsOutput | { error: string }> {
  try {
    const result = await summarizePredictionsForAstraKairos(input);
    return result;
  } catch (e: any) {
    console.error("Error summarizing predictions for AstraKairos:", e);
    return { error: e.message || "Failed to summarize predictions for AstraKairos." };
  }
}

