export const businessConfig = {
  emailTokenLength: parseInt(process.env["EMAIL_TOKEN_LENGTH"] || "5", 10),

  emailTokenExpiresInMinutes: parseInt(
    process.env["EMAIL_TOKEN_EXPIRES_IN_MINUTES"] || "10",
    10
  )
}
