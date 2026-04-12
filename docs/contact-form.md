# Contact Form

The contact page (`/contact`) uses a server action to send form submissions via Resend.

## Behavior

- Users submit from the form on `app/contact/page.tsx`.
- `app/contact/contact-form.tsx` handles pending/success/error UI with `useActionState`.
- `app/contact/actions.ts` validates input, sanitizes values, and sends the email through Resend.

Current delivery settings:
- To: `Hello@westcoastbeautyco.com`
- From: `West Coast Beauty Co <${RESEND_FROM_EMAIL}>`
- Reply-To: submitter email

## Environment

Required:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (sender address on a verified Resend domain)

Setup:
1. Copy `.env.example` to `.env.local`.
2. Set `RESEND_API_KEY` in `.env.local`.
3. Set `RESEND_FROM_EMAIL` in `.env.local`.

## Notes

- No submission data is stored in a database in the current implementation.
- Spam protection (captcha/rate limiting) is not included in this version.
