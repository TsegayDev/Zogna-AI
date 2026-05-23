'use server';

/**
 * @fileOverview Implements a Genkit flow to enhance failed AI responses by re-attempting with a slightly different prompt.
 *
 * - enhanceFailedResponse - A function that enhances a failed AI response with a re-attempt using a refined prompt.
 * - EnhanceFailedResponseInput - The input type for the enhanceFailedResponse function.
 * - EnhanceFailedResponseOutput - The return type for the enhanceFailedResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EnhanceFailedResponseInputSchema = z.object({
  originalPrompt: z.string().describe('The original prompt that resulted in a failed response.'),
  failedResponse: z.string().describe('The content of the failed AI response.'),
});
export type EnhanceFailedResponseInput = z.infer<typeof EnhanceFailedResponseInputSchema>;

const EnhanceFailedResponseOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The enhanced prompt generated for a re-attempt.'),
});
export type EnhanceFailedResponseOutput = z.infer<typeof EnhanceFailedResponseOutputSchema>;

export async function enhanceFailedResponse(input: EnhanceFailedResponseInput): Promise<EnhanceFailedResponseOutput> {
  return enhanceFailedResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceFailedResponsePrompt',
  input: {schema: EnhanceFailedResponseInputSchema},
  output: {schema: EnhanceFailedResponseOutputSchema},
  prompt: `You are an AI prompt enhancer. You will analyze the original prompt and the failed response to generate a slightly different prompt that might yield a better result.

Original Prompt: {{{originalPrompt}}}
Failed Response: {{{failedResponse}}}

Enhanced Prompt:`, // Provide instructions and context to the LLM.
});

const enhanceFailedResponseFlow = ai.defineFlow(
  {
    name: 'enhanceFailedResponseFlow',
    inputSchema: EnhanceFailedResponseInputSchema,
    outputSchema: EnhanceFailedResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
