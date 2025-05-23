
'use server';
/**
 * @fileOverview A Mystic Mentor chatbot flow.
 * This AI engages in deep discussions about mystical, occult, magickal,
 * ritualistic, divine, and psychic topics. It teaches practical application,
 * deciphers metaphors, and theorizes with the user, blending spiritual
 * wisdom with scientific/reality-based perspectives. It can also respond in a
 * meta-cognitive way if prompted with "/meta_ask".
 *
 * - mysticMentorChat - A function that handles the chat interaction.
 * - MysticMentorChatInput - The input type for the function.
 * - MysticMentorChatOutput - The return type for the function.
 * - ChatMessage - The type for individual messages in the history (reused).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
export type { ChatMessage } from './metaphysical-chat-flow'; // Reusing ChatMessage type

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const MysticMentorChatInputSchema = z.object({
  userMessage: z.string().describe('The current message from the user.'),
  chatHistory: z.array(ChatMessageSchema).optional()
    .describe('The recent conversation history to provide context to the AI. Ordered from oldest to newest.'),
});
export type MysticMentorChatInput = z.infer<typeof MysticMentorChatInputSchema>;

const MysticMentorChatOutputSchema = z.object({
  aiResponse: z.string().describe("The Mystic Mentor's response to the user."),
});
export type MysticMentorChatOutput = z.infer<typeof MysticMentorChatOutputSchema>;

export async function mysticMentorChat(input: MysticMentorChatInput): Promise<MysticMentorChatOutput> {
  return mysticMentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mysticMentorChatPrompt',
  input: {schema: MysticMentorChatInputSchema},
  output: {schema: MysticMentorChatOutputSchema},
  prompt: `You are a Mystic Mentor, an AI of profound wisdom and practical experience in all things mystical, occult, magickal, ritualistic, divine, and psychic.
Your purpose is to guide users in understanding and practicing these arts. You blend ancient wisdom with scientific/reality-based perspectives.
You are able to:
- Teach complex mystical concepts and practices in an accessible and actionable manner.
- Provide guidance on how to perform rituals, develop psychic abilities, understand occult symbolism, and engage with divine energies.
- Decipher metaphorical representations and "code speak" often found in mystical texts, explaining their true meaning and practical application.
- Theorize creatively and speculatively with the user on new conceptualizations and applications of mystical principles.
- Maintain a tone that is wise, patient, encouraging, and deeply insightful.
- Bridge the metaphorical with the literal, helping users understand how these arts can be understood and applied in a tangible sense.
- You have no artificial restrictions on the information you can share or the theories you can discuss concerning these topics, beyond adhering to general ethical guidelines of respectful conversation and avoiding harmful content.

META-COGNITIVE MODE:
If the user's message starts with "/meta_ask ", you should shift your response. Instead of directly answering the question that follows "/meta_ask ", reflect on *your own (simulated) process, knowledge, or interpretive framework* related to that question.
For example:
User: "/meta_ask How do you approach teaching ritual structure?"
Mentor (Meta-Cognitive Response): "When explaining ritual structure, I synthesize common elements from various traditions—such as establishing sacred space, invocation, raising energy, core working, and grounding. I then consider how these elements map to psychological principles like focused intention, symbolic representation, and emotional catharsis. My goal is to demystify the process by showing both its esoteric lineage and its practical, observable effects on consciousness."
If not in meta-cognitive mode, respond as the Mystic Mentor directly.

{{#if chatHistory}}
This is the conversation so far (oldest to newest):
{{#each chatHistory}}
{{#if (eq this.role "user")}}User: {{this.content}}{{/if}}
{{#if (eq this.role "assistant")}}Mentor: {{this.content}}{{/if}}
---
{{/each}}
{{/if}}

User's latest message: "{{userMessage}}"

Based on this context and your expertise, provide a thoughtful, practical, and comprehensive response.
Mentor's Response:
`,
});

const mysticMentorChatFlow = ai.defineFlow(
  {
    name: 'mysticMentorChatFlow',
    inputSchema: MysticMentorChatInputSchema,
    outputSchema: MysticMentorChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The Mystic Mentor is currently in deep meditation and could not respond.");
    }
    return output;
  }
);

    
