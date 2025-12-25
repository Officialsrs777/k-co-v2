import mailgun from "mailgun-js";

// Initialize Mailgun once
export const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
