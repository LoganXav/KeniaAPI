const emailConfirmationMail = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Confirmation</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap" rel="stylesheet">
    <style>
      body {
        background-color: #ffffff;
        font-family: 'Nunito', sans-serif;
        color: #111111;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 50px auto;
        padding: 40px 30px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
      }

      .brand {
        background-color: #000000;
        color: #ffffff;
        text-align: center;
        font-family: 'Cal Sans', sans-serif;
        font-size: 28px;
        font-weight: bold;
        padding: 20px;
        border-radius: 8px 8px 0 0;
      }

      .header {
        text-align: center;
        margin: 30px 0 10px;
      }

      .header h1 {
      font-family: 'Cal Sans', sans-serif;
        font-size: 22px;
        font-weight: 700;
        margin: 0;
        color: #000000;
      }

      .content {
        font-size: 16px;
        line-height: 1.6;
        text-align: center;
        color: #1a1a1a;
        margin-top: 10px;
      }

      .token {
        margin: 40px auto;
        display: inline-block;
        padding: 20px 40px;
        font-size: 24px;
        letter-spacing: 4px;
        font-weight: 600;
        border: 1px solid #000000;
        border-radius: 8px;
        font-family: 'Cal Sans', sans-serif;
        background-color: #f9f9f9;
        color: #111;
      }

      .footer {
        margin-top: 50px;
        font-size: 12px;
        color: #999;
        text-align: center;
      }

      @media only screen and (max-width: 600px) {
        .container {
          margin: 20px;
          padding: 20px;
        }

        .token {
          font-size: 20px;
          padding: 15px 30px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">Kenia.</div>
      <div class="header">
        <h1>Email Confirmation</h1>
      </div>
      <div class="content">
        <p>Please use the code below to confirm your email address.</p>
        <div class="token">{{token}}</div>
        <p>If you did not request this email, you can safely ignore it.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Kenia. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;

export default emailConfirmationMail;
