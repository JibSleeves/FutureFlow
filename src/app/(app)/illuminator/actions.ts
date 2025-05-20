
"use server";

import { illuminatorChat, IlluminatorChatInput, IlluminatorChatOutput } from '@/ai/flows/illuminator-chat-flow';

export async function handleIlluminatorChatAction(input: IlluminatorChatInput): Promise<IlluminatorChatOutput | { error: string }> {
  try {
    const result = await illuminatorChat(input);
    return result;
  } catch (e: any) {
    console.error("Error in Illuminator chat:", e);
    return { error: e.message || "The Illuminator is currently unavailable." };
  }
}
