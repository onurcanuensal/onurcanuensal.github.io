import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Kontaktformular ist aktuell nicht verfügbar.' },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Bitte alle Felder ausfüllen.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Bitte eine gültige E-Mail-Adresse eingeben.' },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: 'Veycron Kontakt <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL ?? ''],
      replyTo: email,
      subject: `Neue Anfrage von ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#111827;">Neue Kontaktanfrage über veycron.de</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-weight:600;width:120px;">Name</td>
              <td style="padding:8px 0;color:#111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6B7280;font-weight:600;">E-Mail</td>
              <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#4F46E5;">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top:20px;">
            <p style="color:#6B7280;font-weight:600;margin-bottom:8px;">Nachricht</p>
            <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:16px;color:#111827;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>
          <hr style="margin:32px 0;border:none;border-top:1px solid #E5E7EB;">
          <p style="color:#9CA3AF;font-size:12px;">Diese Mail wurde automatisch vom Kontaktformular auf veycron.de gesendet.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Interner Fehler. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
