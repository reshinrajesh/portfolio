import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { systemPrompt } from '@/lib/context';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Check for API Key
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('Missing Google API Key');
            return new Response('Missing API Key', { status: 500 });
        }

        const result = await streamText({
            model: google('gemini-1.5-flash') as any,
            system: systemPrompt,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
    }
}
