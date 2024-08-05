export type SendAccountActivationEmailArgs = {
  userEmail: string;
  activationToken: string;
};

export type SendPasswordResetLinkArgs = {
  userEmail: string;
  passwordResetLink: string;
};

export type SendEmailArgs = {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
};
