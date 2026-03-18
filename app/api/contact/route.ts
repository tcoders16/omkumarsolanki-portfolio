import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   ?? "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const toEmail = process.env.CONTACT_EMAIL ?? "emailtosolankiom@gmail.com";

    if (!process.env.SMTP_PASS || process.env.SMTP_PASS === "your_gmail_app_password_here") {
      console.log("[Contact Form - dev mode]", { name, email, subject, message });
      return NextResponse.json({ ok: true, dev: true });
    }

    await transporter.sendMail({
      from:     `"Portfolio" <${process.env.SMTP_USER}>`,
      to:       toEmail,
      replyTo:  email,
      subject:  subject ? `[Portfolio] ${subject}` : `[Portfolio] Message from ${name}`,
      html: `
        <div style="font-family:monospace;max-width:600px;padding:32px;background:#0a0a0a;color:#ededed;border-radius:4px;">
          <h2 style="color:#39d9b4;font-size:0.9rem;margin-bottom:20px;letter-spacing:0.1em;text-transform:uppercase;">
            New Portfolio Message
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="color:#555;padding:6px 0;width:80px;font-size:0.72rem;vertical-align:top;">FROM</td>
              <td style="color:#ededed;padding:6px 0;font-size:0.85rem;">${name}</td>
            </tr>
            <tr>
              <td style="color:#555;padding:6px 0;font-size:0.72rem;vertical-align:top;">EMAIL</td>
              <td style="padding:6px 0;">
                <a href="mailto:${email}" style="color:#39d9b4;font-size:0.85rem;">${email}</a>
              </td>
            </tr>
            ${subject ? `
            <tr>
              <td style="color:#555;padding:6px 0;font-size:0.72rem;vertical-align:top;">SUBJECT</td>
              <td style="color:#ededed;padding:6px 0;font-size:0.85rem;">${subject}</td>
            </tr>` : ""}
          </table>
          <div style="border-top:1px solid #1a1a1a;padding-top:20px;">
            <div style="color:#555;font-size:0.65rem;margin-bottom:10px;letter-spacing:0.1em;text-transform:uppercase;">Message</div>
            <div style="color:#c8c4bc;font-size:0.88rem;line-height:1.8;white-space:pre-wrap;">${message}</div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact API error]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
