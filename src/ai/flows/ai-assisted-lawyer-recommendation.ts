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
import {
  getDocs,
  collection,
  query,
  where,
  limit,
  getFirestore,
} from 'firebase/firestore';
import type {Lawyer} from '@/lib/types';
import {initializeApp, getApps, getApp} from 'firebase/app';
import {firebaseConfig} from '@/firebase/config';

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
  lawyerName: z.string().describe('The name of the recommended lawyer. If no specific expert is found, this will be "No Specific Expert Found".'),
  lawFirm: z.string().describe('The law firm the lawyer belongs to.'),
  expertise: z.string().describe("The lawyer's area of expertise."),
  contactInformation: z
    .string()
    .describe("The lawyer's contact information."),
  summary: z
    .string()
    .describe('A brief summary of why this lawyer is a good fit, or an explanation of why no specific expert could be found.'),
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
      expertiseQuery: z
        .string()
        .describe(
          'The area of legal expertise to search for (e.g., "Corporate Law", "Intellectual Property").'
        ),
    }),
    outputSchema: z.object({
      lawyerName: z.string().describe('The name of the recommended lawyer. If no specific expert is found, this will be "No Specific Expert Found".'),
      lawFirm: z.string().describe('The law firm the lawyer belongs to.'),
      expertise: z.string().describe("The lawyer's primary area of expertise."),
      contactInformation: z
        .string()
        .describe(
          'The lawyer\'s contact information (email or "not available").'
        ),
    }),
  },
  async input => {
    const app = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig, 'genkit-firebase-server');
    const firestore = getFirestore(app);
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

    // If no specific expert is found, return a clear indicator.
    return {
      lawyerName: 'No Specific Expert Found',
      lawFirm: 'N/A',
      expertise: 'N/A',
      contactInformation: 'N/A',
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

IF the tool returns a lawyer with the name "No Specific Expert Found", it means a specialist for the user's specific need could not be located. In this case, you MUST:
1. Set the 'lawyerName' output field to "No Specific Expert Found".
2. Set the 'lawFirm', 'expertise', and 'contactInformation' fields to be "N/A".
3. For the 'summary' field, generate a helpful message explaining that while no direct match for their specific need was found, they can browse our directory of vetted legal professionals manually. The tone should be encouraging and helpful.

IF the tool returns a specific lawyer:
1. Use the information returned from the tool to populate all the output fields.
2. Generate a concise, encouraging, and professional summary for the 'summary' field, explaining why the recommended lawyer is an excellent match. The summary should be a single paragraph.`,
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
