export const businessConfig = {
  emailTokenLength: parseInt(process.env["EMAIL_TOKEN_LENGTH"]!, 10),

  passwordResetTokenLength: parseInt(process.env["PASSWORD_RESET_TOKEN_LENGTH"]!),

  emailTokenExpiresInMinutes: parseInt(process.env["EMAIL_TOKEN_EXPIRES_IN_MINUTES"]!, 10),

  passwordResetTokenExpiresInMinutes: parseInt(process.env["PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES"]!, 10),

  passwordResetTokenLink: `${process.env["SERVER_HOST"]!}/api/auth/password-reset/request`,
};
