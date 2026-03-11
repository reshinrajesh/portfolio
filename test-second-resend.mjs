import { Resend } from 'resend';

const resend = new Resend('re_M9SkUfAR_Lzt3ZEnVTZoJuQ2hi1pLk14s');

async function testEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <no-reply@reshinrajesh.in>',
            to: 'admin@reshinrajesh.in',
            replyTo: 'ashwin@gmail.com',
            subject: 'Test Domain Config',
            html: '<p>Test email for domain configuration</p>',
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
        } else {
            console.log('Success:', data);
        }
    } catch (err) {
        console.error('Exception caught:', err);
    }
}

testEmail();
