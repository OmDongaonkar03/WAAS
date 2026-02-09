import { escapeHtml } from "../utils/escapeHtml.js";

export const passwordResetEmailTemplate = ({ name, resetLink }) => {
  const safeName = escapeHtml(name);
  
  return {
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #0a0a0a; border-radius: 12px; border: 1px solid #1a1a1a;">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                      <span style="color: #00ff00; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">● Workforce as a Service</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      Reset your password
                    </h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <p style="margin: 0 0 20px; color: #b0b0b0; font-size: 16px; line-height: 24px;">
                      Hi ${safeName},
                    </p>
                    <p style="margin: 0 0 20px; color: #b0b0b0; font-size: 16px; line-height: 24px;">
                      We received a request to reset your password for your WAAS account. Click the button below to create a new password.
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" style="margin: 30px 0;">
                      <tr>
                        <td style="border-radius: 8px; background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);">
                          <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #000000; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0; color: #707070; font-size: 14px; line-height: 20px;">
                      This link will expire in 15 minutes for security reasons. If you didn't request a password reset, you can safely ignore this email.
                    </p>
                    
                    <!-- Alternative link -->
                    <p style="margin: 20px 0 0; color: #606060; font-size: 13px; line-height: 18px;">
                      If the button doesn't work, copy and paste this link into your browser:
                      <br>
                      <a href="${resetLink}" style="color: #00ff00; word-break: break-all; text-decoration: none;">${resetLink}</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #1a1a1a;">
                    <p style="margin: 0; color: #505050; font-size: 13px; line-height: 18px; text-align: center;">
                      © ${new Date().getFullYear()} WAAS. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      Hi ${safeName},
      
      We received a request to reset your password for your WAAS account. Click the link below to create a new password:
      
      ${resetLink}
      
      This link will expire in 15 minutes for security reasons. If you didn't request a password reset, you can safely ignore this email.
      
      © ${new Date().getFullYear()} WAAS. All rights reserved.
    `
  };
};