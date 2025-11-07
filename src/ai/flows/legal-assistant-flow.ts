'use server';
/**
 * @fileOverview A conversational AI assistant for legal queries.
 *
 * This flow answers legal questions, explains rights, and guides users
 * through the platform using text and voice.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const LegalAssistantInputSchema = z.object({
  query: z.string().describe("The user's legal query or question."),
});
export type LegalAssistantInput = z.infer<typeof LegalAssistantInputSchema>;

// Output Schema
const LegalAssistantOutputSchema = z.object({
  textResponse: z.string().describe("The AI's text-based answer to the user's query."),
});
export type LegalAssistantOutput = z.infer<typeof LegalAssistantOutputSchema>;


const legalAssistantTextPrompt = `You are a helpful and knowledgeable AI assistant.
      A user has a question. Provide a clear, concise, and informative answer.
      If the query is conversational (like "hello"), respond conversationally.

      User's query: "`;


// Define the main flow
const legalAssistantFlow = ai.defineFlow(
  {
    name: 'legalAssistantFlow',
    inputSchema: LegalAssistantInputSchema,
    outputSchema: LegalAssistantOutputSchema,
  },
  async (input) => {
    
    // 1. Generate the text response first.
    const textResult = await ai.generate({
        prompt: `${input.query}`,
    });

    return {
      textResponse: textResult.text,
    };
  }
);


// Exported wrapper function
export async function legalAssistant(
  input: LegalAssistantInput
): Promise<LegalAssistantOutput> {
  return legalAssistantFlow(input);
}
