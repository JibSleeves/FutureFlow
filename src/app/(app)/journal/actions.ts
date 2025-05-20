
"use server";

import { summarizePredictionsForAstraKairos, SummarizePredictionsInput, SummarizePredictionsOutput } from '@/ai/flows/summarize-predictions';
import { linkKarmicEchoes, LinkKarmicEchoesInput, LinkKarmicEchoesOutput } from '@/ai/flows/link-karmic-echoes';
import { analyzeSymbolicPolarity, AnalyzeSymbolicPolarityInput, AnalyzeSymbolicPolarityOutput } from '@/ai/flows/analyze-symbolic-polarity';

export async function handleSummarizePredictionsAction(input: SummarizePredictionsInput): Promise<SummarizePredictionsOutput | { error: string }> {
  try {
    const result = await summarizePredictionsForAstraKairos(input);
    return result;
  } catch (e: any) {
    console.error("Error summarizing predictions for AstraKairos:", e);
    return { error: e.message || "Failed to summarize predictions for AstraKairos." };
  }
}

export async function handleLinkKarmicEchoesAction(input: LinkKarmicEchoesInput): Promise<LinkKarmicEchoesOutput | { error: string }> {
  try {
    const result = await linkKarmicEchoes(input);
    return result;
  } catch (e: any) {
    console.error("Error linking karmic echoes:", e);
    return { error: e.message || "Failed to link karmic echoes." };
  }
}

export async function handleAnalyzeSymbolicPolarityAction(input: AnalyzeSymbolicPolarityInput): Promise<AnalyzeSymbolicPolarityOutput | { error: string }> {
  try {
    const result = await analyzeSymbolicPolarity(input);
    return result;
  } catch (e: any) {
    console.error("Error analyzing symbolic polarity:", e);
    return { error: e.message || "Failed to analyze symbolic polarity." };
  }
}
    
