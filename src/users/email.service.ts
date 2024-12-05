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

  async sendRegistrationConfirmation(
    userEmail: string,
    username: string,
  ) {
    const FRONTEND_URL = this.config.get('FRONTEND_URL');
    const EMAIL_USER = this.config.get('EMAIL_USER');
    const mailOptions = {
      from: EMAIL_USER,
      to: userEmail,
      subject:
        'Welcome to Chennai Trail Club - Registration Confirmation',
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
}
