import { Resend } from 'resend';

const resend = new Resend('re_M9SkUfAR_Lzt3ZEnVTZoJuQ2hi1pLk14s');

async function testEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>',
            to: 'reshinrajesh@gmail.com', // fallback from route.ts
            subject: 'Test Email',
            html: '<p>Test email</p>',
        });

        if (error) {
            console.error('Resend Error:', error);
        } else {
            console.log('Success:', data);
        }
    } catch (err) {
        console.error('Caught error:', err);
    }
}

testEmail();
