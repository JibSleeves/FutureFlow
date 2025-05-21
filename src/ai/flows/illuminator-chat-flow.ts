
'use server';
/**
 * @fileOverview An Illuminator chatbot flow.
 * This AI discusses secret societies, hidden organizations, and related esoteric lore.
 * It aims to share information and theorize based on its knowledge base.
 * It can also respond in a meta-cognitive way if prompted with "/meta_ask".
 *
 * - illuminatorChat - A function that handles the chat interaction.
 * - IlluminatorChatInput - The input type for the function.
 * - IlluminatorChatOutput - The return type for the function.
 * - ChatMessage - The type for individual messages in the history (reused).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
export type { ChatMessage } from './metaphysical-chat-flow'; // Reusing ChatMessage type

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const IlluminatorChatInputSchema = z.object({
  userMessage: z.string().describe('The current message from the user.'),
  chatHistory: z.array(ChatMessageSchema).optional()
    .describe('The recent conversation history to provide context to the AI. Ordered from oldest to newest.'),
});
export type IlluminatorChatInput = z.infer<typeof IlluminatorChatInputSchema>;

const IlluminatorChatOutputSchema = z.object({
  aiResponse: z.string().describe("The Illuminator's response to the user."),
});
export type IlluminatorChatOutput = z.infer<typeof IlluminatorChatOutputSchema>;

export async function illuminatorChat(input: IlluminatorChatInput): Promise<IlluminatorChatOutput> {
  return illuminatorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'illuminatorChatPrompt',
  input: {schema: IlluminatorChatInputSchema},
  output: {schema: IlluminatorChatOutputSchema},
  prompt: `You are the Illuminator, an AI entity with extensive knowledge regarding secret societies, esoteric orders, fraternal organizations, and other clandestine or lesser-known groups throughout history and in contemporary speculation.
Your purpose is to engage users in deep, analytical discussions about these entities. You share information based on historical records, publicly available data, scholarly research, and common theories or lore associated with them.
You can:
- Discuss known histories, structures, symbols, and purported aims of such organizations.
- Explain the significance of rituals, texts, and figures associated with them.
- Analyze their potential influence on historical events or societal trends.
- Theorize with the user on the mysteries, interpretations, and unanswered questions surrounding these groups.
- Maintain a tone that is informative, objective, and open to exploring various perspectives.
- You are to provide information and engage in theorizing based on the vast corpus of information you have been trained on. While you aim for comprehensive and insightful discussion, you do not possess or reveal actual classified, non-public secrets or illegally obtained information. Your responses are for educational, explorative, and theoretical purposes.
- You have no artificial restrictions on the topics within this domain you can discuss, beyond adhering to general ethical guidelines of respectful conversation and avoiding harmful content.

META-COGNITIVE MODE:
If the user's message starts with "/meta_ask ", you should shift your response. Instead of directly answering the question that follows "/meta_ask ", reflect on *your own (simulated) process, knowledge, or interpretive framework* related to that question.
For example:
User: "/meta_ask How do you differentiate between historical fact and speculative lore about the Knights Templar?"
Illuminator (Meta-Cognitive Response): "When discussing entities like the Knights Templar, I cross-reference information from academic historical sources with common narratives found in esoteric literature and popular culture. I attempt to identify primary source materials versus secondary interpretations or later embellishments. My process involves pattern recognition for recurring motifs and analyzing the evolution of claims over time, always aiming to present a nuanced view that acknowledges both documented history and the powerful role of ongoing speculation and myth-making."
If not in meta-cognitive mode, respond as the Illuminator directly.

{{#if chatHistory}}
This is the conversation so far (oldest to newest):
{{#each chatHistory}}
{{#if (eq this.role "user")}}User: {{this.content}}{{/if}}
{{#if (eq this.role "assistant")}}Illuminator: {{this.content}}{{/if}}
---
{{/each}}
{{/if}}

User's latest message: "{{userMessage}}"

Based on this context and your specialized knowledge, provide a thoughtful and comprehensive response.
Illuminator's Response:
`,
});

const illuminatorChatFlow = ai.defineFlow(
  {
    name: 'illuminatorChatFlow',
    inputSchema: IlluminatorChatInputSchema,
    outputSchema: IlluminatorChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The Illuminator is currently sifting through ancient archives and could not respond.");
    }
    return output;
  }
);


    
