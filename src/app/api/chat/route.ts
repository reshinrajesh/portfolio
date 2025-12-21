import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { systemPrompt } from '@/lib/context';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        console.log('Sending request to OpenAI with messages count:', messages.length);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        });

        console.log('OpenAI response received');
        const stream = OpenAIStream(response as any);
        return new StreamingTextResponse(stream);
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
