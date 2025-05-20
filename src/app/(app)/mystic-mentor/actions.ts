
"use server";

import { mysticMentorChat, MysticMentorChatInput, MysticMentorChatOutput } from '@/ai/flows/mystic-mentor-flow';

export async function handleMysticMentorChatAction(input: MysticMentorChatInput): Promise<MysticMentorChatOutput | { error: string }> {
  try {
    const result = await mysticMentorChat(input);
    return result;
  } catch (e: any) {
    console.error("Error in Mystic Mentor chat:", e);
    return { error: e.message || "The Mystic Mentor is currently unavailable." };
  }
}
