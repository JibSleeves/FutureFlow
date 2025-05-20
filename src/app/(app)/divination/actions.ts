
"use server";

import { generateInsights, GenerateInsightsInput, AstraKairosInsight } from '@/ai/flows/generate-insights';
import { getAstralWeather, GetAstralWeatherInput, GetAstralWeatherOutput } from '@/ai/flows/get-astral-weather';
import { evolveSymbolicSeed, EvolveSymbolicSeedInput, EvolveSymbolicSeedOutput } from '@/ai/flows/evolve-symbolic-seed';
import { generateWhisper, GenerateWhisperInput, GenerateWhisperOutput } from '@/ai/flows/generate-whisper';
import { getDailySymbolicFocus, GetDailySymbolicFocusInput, GetDailySymbolicFocusOutput } from '@/ai/flows/get-daily-symbolic-focus';


export async function handleGenerateInsightsAction(input: GenerateInsightsInput): Promise<AstraKairosInsight | { error: string }> {
  try {
    const result = await generateInsights(input);
    return result;
  } catch (e: any) {
    console.error("Error generating insights with AstraKairos:", e);
    return { error: e.message || "Failed to generate insights with AstraKairos." };
  }
}

export async function handleGetAstralWeatherAction(input: GetAstralWeatherInput): Promise<GetAstralWeatherOutput | { error: string }> {
  try {
    const result = await getAstralWeather(input);
    return result;
  } catch (e: any) {
    console.error("Error getting astral weather:", e);
    return { error: e.message || "Failed to get astral weather." };
  }
}

export async function handleEvolveSymbolicSeedAction(input: EvolveSymbolicSeedInput): Promise<EvolveSymbolicSeedOutput | { error: string }> {
  try {
    const result = await evolveSymbolicSeed(input);
    return result;
  } catch (e: any) {
    console.error("Error evolving symbolic seed:", e);
    return { error: e.message || "Failed to evolve symbolic seed." };
  }
}

export async function handleGenerateWhisperAction(input: GenerateWhisperInput): Promise<GenerateWhisperOutput | { error: string }> {
  try {
    const result = await generateWhisper(input);
    return result;
  } catch (e: any) {
    console.error("Error generating whisper:", e);
    return { error: e.message || "Failed to generate whisper." };
  }
}

export async function handleGetDailySymbolicFocusAction(input: GetDailySymbolicFocusInput): Promise<GetDailySymbolicFocusOutput | { error: string }> {
  try {
    const result = await getDailySymbolicFocus(input);
    return result;
  } catch (e: any) {
    console.error("Error getting daily symbolic focus:", e);
    return { error: e.message || "Failed to get daily symbolic focus." };
  }
}
    

    
