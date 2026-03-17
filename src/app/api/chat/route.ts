import { systemPrompt } from '@/lib/context';
import * as Sentry from '@sentry/nextjs';

export const maxDuration = 30;

// Simple in-memory rate limiting
const ipRequestCount = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5; // requests
const TIME_WINDOW = 60 * 1000; // 1 minute

export async function POST(req: Request) {
    try {
        // --- Rate Limiting Logic ---
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const now = Date.now();
        const requestData = ipRequestCount.get(ip);

        if (requestData) {
            if (now - requestData.timestamp < TIME_WINDOW) {
                if (requestData.count >= RATE_LIMIT) {
                    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), { status: 429 });
                }
                requestData.count += 1;
            } else {
                // Reset window
                ipRequestCount.set(ip, { count: 1, timestamp: now });
            }
        } else {
            ipRequestCount.set(ip, { count: 1, timestamp: now });
        }

        // Clean up old entries periodically (basic garbage collection to avoid memory leaks)
        if (ipRequestCount.size > 1000) {
            for (const [key, value] of ipRequestCount.entries()) {
                if (now - value.timestamp > TIME_WINDOW) {
                    ipRequestCount.delete(key);
                }
            }
        }
        // ---------------------------

        const { messages } = await req.json();

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            Sentry.captureMessage('Missing GOOGLE_GENERATIVE_AI_API_KEY', { level: 'error', tags: { route: 'chat' } });
            console.error('Missing Google API Key');
            return new Response('Missing API Key', { status: 500 });
        }

        // Extract system message and user/model history
        const sysMsg = messages.find((m: any) => m.role === 'system')?.content || systemPrompt;
        const history = messages
            .filter((m: any) => m.role !== 'system')
            .map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: { text: sysMsg } },
                contents: history
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            Sentry.captureMessage(`Gemini API Error: ${response.status}`, { level: 'error', tags: { route: 'chat', provider: 'gemini' }, extra: { status: response.status, body: errorText } });
            console.error('Gemini API Error:', errorText);
            return new Response(JSON.stringify({ error: 'Failed to generate response from Gemini' }), { status: response.status });
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return new Response(generatedText, {
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (error) {
        Sentry.captureException(error, { tags: { route: 'chat' } });
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
    }
}
