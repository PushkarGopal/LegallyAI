'use server';
/**
 * @fileOverview AI-assisted lawyer recommendation flow.
 *
 * This flow recommends lawyers based on user's legal needs, industry, and other relevant factors.
 * It uses a tool to find the correct legal expert from the Firestore database.
 *
 * @interface AIAssistedLawyerRecommendationInput - Input for the AI-assisted lawyer recommendation flow.
 * @interface AIAssistedLawyerRecommendationOutput - Output of the AI-assisted lawyer recommendation flow.
 * @function recommendLawyer - Main function to trigger the lawyer recommendation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getDocs, collection, query, where, limit} from 'firebase/firestore';
import {getSdks} from '@/firebase';
import type {Lawyer} from '@/lib/types';
import { initializeFirebase } from '@/firebase';

// Input schema for the AI-assisted lawyer recommendation flow
const AIAssistedLawyerRecommendationInputSchema = z.object({
  legalNeeds: z.string().describe("The user's legal needs."),
  industry: z.string().describe("The user's industry."),
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
  expertise: z.string().describe("The lawyer's area of expertise."),
  contactInformation: z
    .string()
    .describe("The lawyer's contact information."),
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
      'Finds the most suitable lawyer from the database based on legal needs, industry, and other relevant factors. Prefers lawyers with expertise matching the legal needs.',
    inputSchema: z.object({
      expertiseQuery: z.string().describe('The area of legal expertise to search for (e.g., "Corporate Law", "Intellectual Property").'),
    }),
    outputSchema: z.object({
      lawyerName: z.string().describe('The name of the recommended lawyer.'),
      lawFirm: z.string().describe('The law firm the lawyer belongs to.'),
      expertise: z.string().describe("The lawyer's primary area of expertise."),
      contactInformation: z
        .string()
        .describe('The lawyer\'s contact information (email or "not available").'),
    }),
  },
  async input => {
    // This tool now queries Firestore to find a real lawyer.
    const { firestore } = initializeFirebase();
    const lawyersRef = collection(firestore, 'lawyers');
    
    // Query for a lawyer with matching expertise.
    const q = query(
      lawyersRef,
      where('expertise', 'array-contains', input.expertiseQuery),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const lawyerDoc = querySnapshot.docs[0];
      const lawyerData = lawyerDoc.data() as Lawyer;
      return {
        lawyerName: lawyerData.name,
        lawFirm: lawyerData.firm,
        expertise: lawyerData.expertise[0] || 'General Practice',
        contactInformation: 'jane.doe@example.com', // Placeholder, as user contact info is private
      };
    }

    // Fallback if no specific expertise is found, return the first lawyer.
    const allLawyersSnap = await getDocs(query(collection(firestore, 'lawyers'), limit(1)));
    if (!allLawyersSnap.empty) {
        const lawyerData = allLawyersSnap.docs[0].data() as Lawyer;
        return {
            lawyerName: lawyerData.name,
            lawFirm: lawyerData.firm,
            expertise: lawyerData.expertise[0] || 'General Practice',
            contactInformation: 'jane.doe@example.com',
        };
    }


    // Final fallback if the database is empty
    return {
      lawyerName: 'Jane Doe (Placeholder)',
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
  prompt: `You are an expert legal matchmaker. Your task is to recommend the best lawyer for a user based on their needs.

User's legal situation:
- Legal Needs: {{{legalNeeds}}}
- Industry: {{{industry}}}
{{#if otherRelevantFactors}}- Other Factors: {{{otherRelevantFactors}}}{{/if}}

First, identify the primary area of legal expertise required from the user's description (e.g., "Corporate Law", "Intellectual Property").
Then, use the findLegalExpert tool to find a suitable lawyer with that expertise.

Finally, generate a concise, encouraging, and professional summary explaining why the recommended lawyer is an excellent match. The summary should be a single paragraph.

Use the information returned from the tool to populate the output fields.`,
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
