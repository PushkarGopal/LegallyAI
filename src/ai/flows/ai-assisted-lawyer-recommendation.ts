'use server';
/**
 * @fileOverview AI-assisted lawyer recommendation flow.
 *
 * This flow recommends lawyers based on user's legal needs, industry, and other relevant factors.
 * It uses a tool to find the correct legal expert.
 *
 * @interface AIAssistedLawyerRecommendationInput - Input for the AI-assisted lawyer recommendation flow.
 * @interface AIAssistedLawyerRecommendationOutput - Output of the AI-assisted lawyer recommendation flow.
 * @function recommendLawyer - Main function to trigger the lawyer recommendation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the AI-assisted lawyer recommendation flow
const AIAssistedLawyerRecommendationInputSchema = z.object({
  legalNeeds: z.string().describe('The user\'s legal needs.'),
  industry: z.string().describe('The user\'s industry.'),
  otherRelevantFactors: z
    .string()
    .optional()
    .describe('Other relevant factors to consider.'),
});

export type AIAssistedLawyerRecommendationInput = z.infer<
  typeof AIAssistedLawyerRecommendationInputSchema
>;

// Output schema for the AI-assisted lawyer recommendation flow
const AIAssistedLawyerRecommendationOutputSchema = z.object({
  lawyerName: z.string().describe('The name of the recommended lawyer.'),
  lawFirm: z.string().describe('The law firm the lawyer belongs to.'),
  expertise: z.string().describe('The lawyer\'s area of expertise.'),
  contactInformation: z
    .string()
    .describe('The lawyer\'s contact information.'),
  summary: z
    .string()
    .describe('A brief summary of why this lawyer is a good fit.'),
});

export type AIAssistedLawyerRecommendationOutput = z.infer<
  typeof AIAssistedLawyerRecommendationOutputSchema
>;

// Define the tool to find the correct legal expert
const findLegalExpert = ai.defineTool(
  {
    name: 'findLegalExpert',
    description:
      'Finds the most suitable lawyer based on legal needs, industry, and other relevant factors.',
    inputSchema: AIAssistedLawyerRecommendationInputSchema,
    outputSchema: z.object({
      lawyerName: z.string().describe('The name of the recommended lawyer.'),
      lawFirm: z.string().describe('The law firm the lawyer belongs to.'),
      expertise: z.string().describe('The lawyer\'s area of expertise.'),
      contactInformation: z
        .string()
        .describe('The lawyer\'s contact information.'),
    }),
  },
  async input => {
    // TODO: Implement the logic to find the legal expert here.
    // This is a placeholder implementation.
    return {
      lawyerName: 'Jane Doe',
      lawFirm: 'Doe & Associates',
      expertise: 'Corporate Law',
      contactInformation: 'jane.doe@example.com',
    };
  }
);

// Define the prompt to generate the lawyer recommendation summary
const recommendLawyerPrompt = ai.definePrompt({
  name: 'recommendLawyerPrompt',
  tools: [findLegalExpert],
  input: {schema: AIAssistedLawyerRecommendationInputSchema},
  output: {schema: AIAssistedLawyerRecommendationOutputSchema},
  prompt: `Based on the user's legal needs: {{{legalNeeds}}}, industry: {{{industry}}}, and other relevant factors: {{{otherRelevantFactors}}}, find the most suitable lawyer and provide a summary of why this lawyer is a good fit.

  Use the findLegalExpert tool to get the lawyer's information.
  Then, write a summary of why this lawyer is a good fit for the user.
  Lawyer Name: {{findLegalExpert.lawyerName}}
  Law Firm: {{findLegalExpert.lawFirm}}
  Expertise: {{findLegalExpert.expertise}}
  Contact Information: {{findLegalExpert.contactInformation}}
  Summary: `,
});

// Define the flow for AI-assisted lawyer recommendation
const recommendLawyerFlow = ai.defineFlow(
  {
    name: 'recommendLawyerFlow',
    inputSchema: AIAssistedLawyerRecommendationInputSchema,
    outputSchema: AIAssistedLawyerRecommendationOutputSchema,
  },
  async input => {
    const {output} = await recommendLawyerPrompt(input);
    return output!;
  }
);

// Exported function to trigger the lawyer recommendation flow
export async function recommendLawyer(
  input: AIAssistedLawyerRecommendationInput
): Promise<AIAssistedLawyerRecommendationOutput> {
  return recommendLawyerFlow(input);
}
