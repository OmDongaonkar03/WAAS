/**
 * Email template for email change verification
 * Add this to your templates folder (e.g., templates/emailChangeEmail.js)
 */

export const emailChangeVerificationTemplate = ({
  name,
  oldEmail,
  newEmail,
  verificationLink,
}) => {
  const subject = "Verify Your New Email Address";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Email Change</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #6366f1;
      margin-bottom: 10px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #6366f1;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #4f46e5;
    }
    .info-box {
      background-color: #f3f4f6;
      border-left: 4px solid #6366f1;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 5px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    .warning {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">WAAS</div>
      <h1 style="color: #1f2937; margin: 0;">Verify Email Change</h1>
    </div>
    
    <div class="content">
      <p>Hi ${name},</p>
      
      <p>We received a request to change your email address.</p>
      
      <div class="info-box">
        <p><strong>Old Email:</strong> ${oldEmail}</p>
        <p><strong>New Email:</strong> ${newEmail}</p>
      </div>
      
      <p>To complete this change and verify your new email address, please click the button below:</p>
      
      <div style="text-align: center;">
        <a href="${verificationLink}" class="button">Verify New Email</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Or copy and paste this link into your browser:<br>
        <a href="${verificationLink}" style="color: #6366f1; word-break: break-all;">${verificationLink}</a>
      </p>
      
      <div class="warning">
        <p style="margin: 0; font-weight: 600;">⚠️ Important Security Notice</p>
        <p style="margin: 5px 0 0 0;">
          This link will expire in 15 minutes. If you didn't request this email change, please ignore this message and contact support immediately.
        </p>
      </div>
      
      <p>After verification, you'll need to use your new email address to log in.</p>
    </div>
    
    <div class="footer">
      <p>This email was sent to ${newEmail}</p>
      <p>If you have any questions, please contact our support team.</p>
      <p style="margin-top: 20px;">
        © ${new Date().getFullYear()} WAAS. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Hi ${name},

We received a request to change your email address.

Old Email: ${oldEmail}
New Email: ${newEmail}

To complete this change and verify your new email address, please click the link below:

${verificationLink}

⚠️ IMPORTANT: This link will expire in 15 minutes. If you didn't request this email change, please ignore this message and contact support immediately.

After verification, you'll need to use your new email address to log in.

This email was sent to ${newEmail}

If you have any questions, please contact our support team.

© ${new Date().getFullYear()} WAAS. All rights reserved.
  `;

  return {
    subject,
    html,
    text,
  };
};