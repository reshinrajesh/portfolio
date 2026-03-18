import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
    if (!resend) {
        return NextResponse.json(
            { error: 'Email service is not configured' },
            { status: 500 }
        );
    }

    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: 'Contact Form <no-reply@reshinrajesh.in>', // Use custom domain email
            to: process.env.CONTACT_EMAIL || 'connect@reshinrajesh.in', // User's personal email
            replyTo: email,
            subject: `Contact Form: ${subject || 'New Message from Portfolio'}`,
            text: `You have received a new message from your portfolio website's contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'None provided'}\n\nMessage:\n${message}\n\n---\nThis email was sent via the reshinrajesh.in contact form.`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <p style="color: #555;">You have received a new message from the contact form on your portfolio website.</p>
            <hr style="border: 1px solid #eee; my-4" />
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || 'None provided'}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</p>
            </div>
            <br/>
            <p style="font-size: 0.8em; color: #888;">This email was sent via the reshinrajesh.in contact form.</p>
        </div>
      `,
        });

        if (error) {
            Sentry.captureException(error, { tags: { route: 'contact', provider: 'resend' } });
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send message' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        Sentry.captureException(error, { tags: { route: 'contact' } });
        console.error('Contact form API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
