
"use server";

import { generateSigil, GenerateSigilInput, GenerateSigilOutput } from '@/ai/flows/generate-sigil';

export async function handleGenerateSigilAction(input: GenerateSigilInput): Promise<GenerateSigilOutput | { error: string }> {
  try {
    const result = await generateSigil(input);
    return result;
  } catch (e: any) {
    console.error("Error generating sigil with AstraKairos:", e);
    return { error: e.message || "Failed to generate sigil with AstraKairos." };
  }
}
