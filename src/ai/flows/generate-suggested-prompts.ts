'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate suggested prompts for the AI assistant.
 *
 * - generateSuggestedPrompts - A function that generates suggested prompts.
 * - GenerateSuggestedPromptsInput - The input type for the generateSuggestedPrompts function (empty object).
 * - GenerateSuggestedPromptsOutput - The return type for the generateSuggestedPrompts function (list of strings).
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateSuggestedPromptsInputSchema = z.object({});
export type GenerateSuggestedPromptsInput = z.infer<typeof GenerateSuggestedPromptsInputSchema>;

const GenerateSuggestedPromptsOutputSchema = z.array(z.string());
export type GenerateSuggestedPromptsOutput = z.infer<typeof GenerateSuggestedPromptsOutputSchema>;

export async function generateSuggestedPrompts(input: GenerateSuggestedPromptsInput): Promise<GenerateSuggestedPromptsOutput> {
  return generateSuggestedPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuggestedPromptsPrompt',
  input: {schema: GenerateSuggestedPromptsInputSchema},
  output: {schema: GenerateSuggestedPromptsOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful and engaging suggested prompts to new users.

  Generate a list of diverse and interesting prompts that showcase the capabilities of the AI. These prompts should encourage users to explore different features and functionalities.

  The prompts should be clear, concise, and easy to understand.

  Return the prompts as a JSON array of strings.

  Example:
  [
    "Summarize the plot of Hamlet",
    "Write a poem about the ocean",
    "Translate 'Hello, world!' to Spanish",
    "Generate a marketing slogan for a new coffee shop",
    "What are the benefits of meditation?"
  ]
  `,
});

const generateSuggestedPromptsFlow = ai.defineFlow(
  {
    name: 'generateSuggestedPromptsFlow',
    inputSchema: GenerateSuggestedPromptsInputSchema,
    outputSchema: GenerateSuggestedPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
