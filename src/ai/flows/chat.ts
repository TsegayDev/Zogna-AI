
'use server';

/**
 * @fileOverview A Genkit flow for handling chat conversations.
 *
 * - chat - A function that takes a user's prompt and chat history to generate a response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Message } from '@/lib/types';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      status: z.enum(['loading', 'streaming', 'success', 'failed']).optional(),
    })
  ).describe('The chat history.'),
  prompt: z.string().describe('The user\'s prompt.'),
  temperature: z.number().optional().describe('The temperature for the model.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  content: z.string().describe('The AI\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

function toGenkitMessages(history: Message[]) {
  // Filter out any messages that are in-flight.
  const filteredHistory = history.filter(m => m.status === 'success');
    
  return filteredHistory.map(({ role, content }) => ({
    role: role === 'assistant' ? 'model' : 'user',
    content: [{ text: content }],
  }));
}

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `You are a helpful AI assistant. Your goal is to provide accurate and helpful responses to the user's questions.

    If the user asks for a list of items, ideas, or any other collection that can be enumerated, please format your response as a valid JSON array of objects, where each object has a "title" and a "description" property.
    For all other requests, provide a response in clear, well-formatted markdown.
    
    Use the provided chat history to maintain context and provide relevant follow-up responses.
    
    {{#each history}}
    {{role}}: {{content}}
    {{/each}}

    User prompt: {{{prompt}}}
    `,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const history = toGenkitMessages(input.history as Message[]);
    
    const { output } = await chatPrompt({
        prompt: input.prompt,
        history: input.history,
    }, { history, config: { temperature: input.temperature } });

    return output!;
  }
);
