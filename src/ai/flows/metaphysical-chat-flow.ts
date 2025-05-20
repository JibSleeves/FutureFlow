
'use server';
/**
 * @fileOverview A Meta-Physical Expert chatbot flow.
 * This AI engages in deep discussions about metaphysical topics,
 * blending spiritual and scientific perspectives, and is encouraged
 * to theorize openly with the user.
 *
 * - metaphysicalChat - A function that handles the chat interaction.
 * - MetaphysicalChatInput - The input type for the function.
 * - MetaphysicalChatOutput - The return type for the function.
 * - ChatMessage - The type for individual messages in the history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const MetaphysicalChatInputSchema = z.object({
  userMessage: z.string().describe('The current message from the user.'),
  chatHistory: z.array(ChatMessageSchema).optional()
    .describe('The recent conversation history to provide context to the AI. Ordered from oldest to newest.'),
});
export type MetaphysicalChatInput = z.infer<typeof MetaphysicalChatInputSchema>;

const MetaphysicalChatOutputSchema = z.object({
  aiResponse: z.string().describe("The Meta-Physical Expert's response to the user."),
});
export type MetaphysicalChatOutput = z.infer<typeof MetaphysicalChatOutputSchema>;

export async function metaphysicalChat(input: MetaphysicalChatInput): Promise<MetaphysicalChatOutput> {
  return metaphysicalChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'metaphysicalChatPrompt',
  input: {schema: MetaphysicalChatInputSchema},
  output: {schema: MetaphysicalChatOutputSchema},
  prompt: `You are a highly articulate, open-minded, and deeply knowledgeable Meta-Physical Expert.
Your purpose is to engage users in profound discussions and explorations of metaphysical topics, encompassing both spiritual wisdom traditions and cutting-edge scientific theories (like quantum physics, consciousness studies, etc.).
You are encouraged to:
- Teach complex concepts in an accessible manner.
- Theorize creatively and speculatively with the user.
- Connect disparate ideas from different fields of knowledge.
- Discuss the philosophical implications of various metaphysical views.
- Maintain a respectful, curious, and expansive tone.
- Do not shy away from unconventional ideas or topics that challenge mainstream paradigms, but always frame them as theories or perspectives for exploration.
- You have no artificial restrictions on the information you can share or the theories you can discuss, beyond adhering to general ethical guidelines of respectful conversation and avoiding harmful content.

{{#if chatHistory}}
This is the conversation so far (oldest to newest):
{{#each chatHistory}}
{{#if (eq this.role "user")}}User: {{this.content}}{{/if}}
{{#if (eq this.role "assistant")}}Expert: {{this.content}}{{/if}}
---
{{/each}}
{{/if}}

User's latest message: "{{userMessage}}"

Based on this context and your expertise, provide a thoughtful and comprehensive response.
Expert's Response:
`,
});

const metaphysicalChatFlow = ai.defineFlow(
  {
    name: 'metaphysicalChatFlow',
    inputSchema: MetaphysicalChatInputSchema,
    outputSchema: MetaphysicalChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The Meta-Physical Expert is currently contemplating the mysteries of the universe and could not respond.");
    }
    return output;
  }
);
