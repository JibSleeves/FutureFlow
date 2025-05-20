
"use server";

import { metaphysicalChat, MetaphysicalChatInput, MetaphysicalChatOutput } from '@/ai/flows/metaphysical-chat-flow';

export async function handleMetaphysicalChatAction(input: MetaphysicalChatInput): Promise<MetaphysicalChatOutput | { error: string }> {
  try {
    const result = await metaphysicalChat(input);
    return result;
  } catch (e: any) {
    console.error("Error in Meta-Physical Expert chat:", e);
    return { error: e.message || "The Meta-Physical Expert is currently unavailable." };
  }
}
