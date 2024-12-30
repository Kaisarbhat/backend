// email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMembershipConfirmation(
    userEmail: string,
    username: string,
  ) {
    const FRONTEND_URL = this.config.get('FRONTEND_URL');
    const EMAIL_USER = this.config.get('EMAIL_USER');
    const mailOptions = {
      from: EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to Chennai Trail Club',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Chennai Trail Club!</h1>
            </div>
            <div class="content">
              <p>Dear ${username},</p>
              <p>Thank you for registering with our platform! We're excited to have you as a member of our community.</p>
              <p>Your account has been successfully created and is ready to use.</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Register For upcoming Events</li>
                <li>Explore our features</li>
                <li>Check our Past Events</li>
              </ul>
              <a href="${FRONTEND_URL}" class="button">Get Started</a>
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>Chennai Trail Club</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${userEmail}. If you didn't register for an account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }

  async eventRegistrationConfirmation(
    event,
    name: string,
    email: string,
  ) {
    const FRONTEND_URL = this.config.get('FRONTEND_URL');
    const EMAIL_USER = this.config.get('EMAIL_USER');
    const date = new Date(event?.date);
    const formattedDate = date.toLocaleDateString('en-Us', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: `Registration Confirmed for Event :  ${event.name}`,
      html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Registration Confirmation</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                          <td style="padding: 20px 0; text-align: center; background-color: #ffffff;">
                              <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                  <tr>
                                      <td style="padding: 40px 30px; text-align: center; background-color: #4CAF50; border-radius: 8px 8px 0 0;">
                                          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Registration Confirmed!</h1>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 30px; text-align: left;">
                                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                              Dear ${name},
                                          </p>
                                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                              Thank you for registering for ${event.name}. Your registration has been successfully processed!
                                          </p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 0 30px;">
                                          <table role="presentation" style="width: 100%; border-radius: 8px; background-color: #f8f9fa; margin-bottom: 30px;">
                                              <tr>
                                                  <td style="padding: 20px;">
                                                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 18px;">Event Details</h2>
                                                      <p style="margin: 0 0 10px 0; color: #666666;">
                                                          <strong>Date:</strong> ${formattedDate}
                                                      </p>
                                                      <p style="margin: 0 0 10px 0; color: #666666;">
                                                          <strong>Location:</strong> ${event.location}
                                                      </p>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>

                                  <tr>
                                      <td style="padding: 0 30px 30px 30px;">
                                          <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 18px;">Next Steps</h2>
                                          <p style="margin: 0 0 10px 0; color: #666666;">1. Save this email for your records</p>
                                          <p style="margin: 0 0 10px 0; color: #666666;">2. Add the event to your calendar</p>
                                          <p style="margin: 0 0 10px 0; color: #666666;">3. Check our Past Events</p>
                                          <p style="margin: 0 0 10px 0; color: #666666;">4. Follow our social media for updates</p>
                                      </td>
                                  </tr>
                                   <tr>
                                      <td style="padding: 0 30px 30px 30px;">
                                          <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 18px;"><a href=${FRONTEND_URL} class="button">Click Here To Visit Our Website</a> </h2>
                                          
                                      </td>
                                  </tr>

                                  <tr>
                                      <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                                          <p style="margin: 0 0 10px 0; color: #666666;">
                                              Questions? Contact us at:
                                          </p>
                                          <p style="margin: 0; color: #666666;">
                                              <a href="mailto:support@example.com" style="color:  #4CAF50; text-decoration: none;">support@chennaiTrailClub.com</a>
                                          </p>
                                          <p>Best regards,<br>Chennai Trail Club</p>
                                         <div class="footer">
                                           <p>This email was sent to ${email}. If you didn't register for the event, please ignore this email.</p>
                                         </div>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </body>
              </html>`,
    };
    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }
}
