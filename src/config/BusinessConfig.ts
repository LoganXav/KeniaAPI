export const businessConfig = {
  emailTokenLength: parseInt(process.env["EMAIL_TOKEN_LENGTH"] || "5", 10),

  passwordResetTokenLength: parseInt(
    process.env["PASSWORD_RESET_TOKEN_LENGTH"] || "5"
  ),

  emailTokenExpiresInMinutes: parseInt(
    process.env["EMAIL_TOKEN_EXPIRES_IN_MINUTES"] || "5",
    10
  ),

  passwordResetTokenExpiresInMinutes: parseInt(
    process.env["PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES"] || "5",
    10
  ),

  passwordResetTokenLink: `${process.env[
    "HOST"
  ]!}/api/auth/password-reset/request`
}
