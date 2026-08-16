import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Bitte eine gültige E-Mail-Adresse eingeben.' },
        { status: 400 }
      );
    }

    // In production, replace with your preferred service:
    // - Resend (transactional email + list)
    // - Buttondown / Mailchimp API
    // - Google Sheets via Apps Script webhook
    // - Supabase / Firebase
    //
    // For now, log to server console (works in dev):
    console.log(`[SIGNUP] ${new Date().toISOString()} — ${email.trim()}`);

    // If RESEND_API_KEY is set, also send notification email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'veycron <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL ?? ''],
        subject: `Neuer Frühzugang: ${email.trim()}`,
        html: `<p>Neue E-Mail für den Frühzugang: <strong>${email.trim()}</strong></p><p>${new Date().toISOString()}</p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'Interner Fehler. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
