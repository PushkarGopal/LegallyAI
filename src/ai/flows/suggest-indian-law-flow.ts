'use server';
/**
 * @fileOverview AI-assisted Indian law suggestion flow.
 *
 * This flow suggests relevant Indian laws based on a user's description of a legal dispute.
 *
 * @interface SuggestIndianLawInput - Input for the law suggestion flow.
 * @interface SuggestIndianLawOutput - Output of the law suggestion flow.
 * @function suggestLaw - Main function to trigger the law suggestion flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the law suggestion flow
const SuggestIndianLawInputSchema = z.object({
  disputeDescription: z.string().describe("A description of the user's legal dispute."),
});

export type SuggestIndianLawInput = z.infer<typeof SuggestIndianLawInputSchema>;

// Output schema for the law suggestion flow
const SuggestIndianLawOutputSchema = z.object({
  suggestions: z.array(z.object({
    law: z.string().describe("The name of the suggested Indian law or act (e.g., 'The Indian Contract Act, 1872')."),
    section: z.string().optional().describe("The specific section of the law, if applicable."),
    explanation: z.string().describe("An explanation of why this law is relevant to the dispute."),
  })).describe("A list of relevant laws and explanations."),
  concludingSolution: z.string().describe("A concluding solution or suggested next steps for the user based on the legal analysis."),
  disclaimer: z.string().describe("A clear disclaimer that this is not legal advice."),
});

export type SuggestIndianLawOutput = z.infer<typeof SuggestIndianLawOutputSchema>;


// Define the prompt to generate the law suggestions
const suggestLawPrompt = ai.definePrompt({
  name: 'suggestLawPrompt',
  input: {schema: SuggestIndianLawInputSchema},
  output: {schema: SuggestIndianLawOutputSchema},
  prompt: `You are an expert AI assistant specializing in Indian law. Your task is to analyze a user's description of a legal dispute and suggest relevant Indian laws, acts, or specific sections that might apply.

User's legal dispute:
"{{{disputeDescription}}}"

Based on this description, please provide a list of relevant legal suggestions. For each suggestion, include:
1. The name of the law or act.
2. The specific section number, if a clear one applies.
3. A concise explanation of why this law is relevant to the user's situation.

After providing the legal suggestions, you MUST formulate a "Concluding Solution". This should be a summary of potential next steps for the user, such as consulting a lawyer specializing in the suggested areas, gathering specific documents, or considering mediation. This should be practical and easy to understand for a non-lawyer.

Finally, you MUST provide a disclaimer at the end. The disclaimer must state: "This information is for educational purposes only and does not constitute legal advice. Please consult with a qualified legal professional for advice on your specific situation."
`,
});

// Define the flow for suggesting Indian laws
const suggestLawFlow = ai.defineFlow(
  {
    name: 'suggestLawFlow',
    inputSchema: SuggestIndianLawInputSchema,
    outputSchema: SuggestIndianLawOutputSchema,
  },
  async input => {
    const {output} = await suggestLawPrompt(input);
    return output!;
  }
);

// Exported function to trigger the law suggestion flow
export async function suggestLaw(
  input: SuggestIndianLawInput
): Promise<SuggestIndianLawOutput> {
  return suggestLawFlow(input);
}
