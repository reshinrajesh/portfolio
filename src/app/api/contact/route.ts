import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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
            from: 'Contact Form <onboarding@resend.dev>', // You should verify a domain in Resend to change this
            to: process.env.CONTACT_EMAIL || 'admin@reshinrajesh.in', // Using verified Resend email
            replyTo: email,
            subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
            text: `
Name: ${name}
Email: ${email}
Subject: ${subject || 'No Subject'}

Message:
${message}
      `,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
        });

        if (error) {
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
        console.error('Contact form API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
