const emailConfirmationMail = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #f4f4f7;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #eaeaea;
      }

      .header h1 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }

      .content {
        padding-top: 20px;
      }

      .token-box {
        margin: 30px 0;
        padding: 15px;
        background-color: #f0f0f5;
        border-left: 5px solid #4f46e5;
        font-size: 20px;
        text-align: center;
        letter-spacing: 2px;
        word-break: break-word;
      }

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Confirmation</h1>
      </div>
      <div class="content">
        <p>Thank you for signing up. Please use the confirmation token below to verify your email address:</p>
        <div class="token-box">
          {{token}}
        </div>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; {{year}} {{company}}. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;

export default emailConfirmationMail;
