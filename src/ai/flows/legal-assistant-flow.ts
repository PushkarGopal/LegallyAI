
'use server';
/**
 * @fileOverview A conversational AI assistant for legal queries.
 *
 * This flow answers legal questions, explains rights, and guides users
 * through the platform using text and voice.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

// Input Schema
const LegalAssistantInputSchema = z.object({
  query: z.string().describe("The user's legal query or question."),
});
export type LegalAssistantInput = z.infer<typeof LegalAssistantInputSchema>;

// Output Schema
const LegalAssistantOutputSchema = z.object({
  textResponse: z.string().describe("The AI's text-based answer to the user's query."),
  audioResponse: z.string().describe("A data URI of the AI's spoken response in WAV format."),
});
export type LegalAssistantOutput = z.infer<typeof LegalAssistantOutputSchema>;


/**
 * Converts PCM audio data to a Base64 encoded WAV string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const legalAssistantTextPrompt = ai.definePrompt({
    name: 'legalAssistantTextPrompt',
    input: { schema: z.object({ query: z.string() }) },
    prompt: `You are LegallyAI, a helpful and knowledgeable AI legal assistant specializing in Indian law.
      A user has a question. Provide a clear, concise, and informative answer.
      If the query is conversational (like "hello"), respond conversationally.
      If the query is a legal question, provide a helpful answer but ALWAYS include a disclaimer that you are an AI assistant and they should consult a qualified human lawyer for professional advice.

      User's query: "{{query}}"`,
    model: googleAI.model('gemini-1.5-pro-latest'),
});


// Define the main flow
const legalAssistantFlow = ai.defineFlow(
  {
    name: 'legalAssistantFlow',
    inputSchema: LegalAssistantInputSchema,
    outputSchema: LegalAssistantOutputSchema,
  },
  async (input) => {
    
    // 1. Generate the text response first.
    const textResponseResult = await legalAssistantTextPrompt(input);
    const textResponse = textResponseResult.text;

    // 2. Generate the audio response from the text
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: textResponse,
      config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
              voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
              },
          },
      },
    });

    if (!media) {
      throw new Error('Text-to-speech audio generation failed.');
    }

    const pcmBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(pcmBuffer);

    return {
      textResponse,
      audioResponse: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);


// Exported wrapper function
export async function legalAssistant(
  input: LegalAssistantInput
): Promise<LegalAssistantOutput> {
  return legalAssistantFlow(input);
}
