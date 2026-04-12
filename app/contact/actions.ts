'use server';

import { Resend } from "resend";

const CONTACT_EMAIL = "Hello@westcoastbeautyco.com";
const CONTACT_FROM_NAME = "West Coast Beauty Co";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_CONTACT_FORM_STATE: ContactFormState = {
  status: "idle",
  message: "",
};

function readFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function sanitizeSingleLine(value: string, maxLength: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeMultiLine(value: string, maxLength: number): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = sanitizeSingleLine(readFormValue(formData, "name"), 120);
  const email = sanitizeSingleLine(readFormValue(formData, "email"), 320).toLowerCase();
  const phone = sanitizeSingleLine(readFormValue(formData, "phone"), 60);
  const comment = sanitizeMultiLine(readFormValue(formData, "comment"), 2000);

  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }

  if (!isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return {
      status: "error",
      message: "Contact form is not configured yet. Please call or text us at 707-633-3323.",
    };
  }

  const resendFromEmail = sanitizeSingleLine(process.env.RESEND_FROM_EMAIL ?? "", 320).toLowerCase();
  if (!resendFromEmail) {
    return {
      status: "error",
      message:
        "Contact form sender is not configured yet. Please call or text us at 707-633-3323.",
    };
  }

  if (!isValidEmail(resendFromEmail)) {
    console.error("Invalid RESEND_FROM_EMAIL value", { resendFromEmail });
    return {
      status: "error",
      message:
        "Contact form sender is misconfigured. Please call or text us at 707-633-3323.",
    };
  }

  const resend = new Resend(resendApiKey);
  const textBody = [
    "New contact form submission",
    "",
    `Name: ${name || "Not provided"}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    "",
    "Comment:",
    comment || "Not provided",
  ].join("\n");

  try {
    const result = await resend.emails.send({
      from: `${CONTACT_FROM_NAME} <${resendFromEmail}>`,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: name ? `New contact form submission from ${name}` : "New contact form submission",
      text: textBody,
    });

    if (result.error) {
      console.error("Contact form email failed", result.error);
      return {
        status: "error",
        message: "Something went wrong while sending your message. Please try again.",
      };
    }
  } catch (error) {
    console.error("Contact form email exception", error);
    return {
      status: "error",
      message: "Something went wrong while sending your message. Please try again.",
    };
  }

  return { status: "success", message: "Thanks! Your message has been sent." };
}
