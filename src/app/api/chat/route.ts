import { systemPrompt } from '@/lib/context';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
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
            console.error('Gemini API Error:', errorText);
            return new Response(JSON.stringify({ error: 'Failed to generate response from Gemini' }), { status: response.status });
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return new Response(generatedText, {
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
    }
}
