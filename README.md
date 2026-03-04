# Omkumar Solanki — Portfolio

Futuristic dark portfolio built with **Next.js 16**, TypeScript, and Tailwind CSS. Features particle animations, glassmorphism cards, and a contact form with email notifications.

## Run Locally

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Enable Email Notifications

Edit `.env.local` with your Gmail credentials:

1. Go to **Google Account → Security → 2-Step Verification → App passwords**
2. Generate an app password for "Mail"
3. Set `SMTP_PASS=your_app_password` in `.env.local`

When configured, every contact form submission will:
- Send you a notification email with all details
- Send the visitor an auto-reply

**Without SMTP:** Submissions still save to `data/contacts.json` — zero config required.

## Deploy Free on Vercel

```bash
npm install -g vercel
vercel
```

Add env vars in Vercel dashboard → Settings → Environment Variables.

## Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + custom CSS variables
- **Animations:** Canvas 2D particle system + CSS
- **Email:** Nodemailer (Gmail SMTP, free)
- **Storage:** JSON file (`data/contacts.json`, no DB required)
- **Fonts:** Geist (local) + Space Grotesk (Google Fonts)
