export const emailConfig = {
  brevo: {
    secure: false,
    smtpUser: process.env["BREVO_SMTP_USER"]!,
    smtpKey: process.env["BREVO_SMTP_KEY"]!
  },
  // TODO - Refactor to env
  mailtrap: {
    secure: false,
    host: "live.smtp.mailtrap.io",
    key: "dae3f19ca35ef52b6891b2924dc7f4e1",
    emailFromEmail: "mailtrap@demomailtrap.com"
  },
  provider: process.env["EMAIL_PROVIDER"]!,
  emailFromEmail: process.env["EMAIL_FROM_EMAIL"]!,
  emailFromName: process.env["EMAIL_FROM_NAME"]!,
  emailSecure: false
}
