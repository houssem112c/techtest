import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('MAIL_PORT') || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"DCMS" <${this.configService.get<string>('MAIL_USER')}>`,
      to: email,
      subject: 'Email Verification - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .otp-code {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-size: 36px;
              font-weight: bold;
              padding: 20px 40px;
              border-radius: 12px;
              display: inline-block;
              margin: 20px 0;
              letter-spacing: 8px;
            }
            .message {
              color: #4b5563;
              font-size: 16px;
              line-height: 1.6;
              margin: 20px 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              text-align: left;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Email Verification</h1>
            </div>
            <div class="content">
              <p class="message">
                Thank you for registering with <strong>DCMS</strong>!
              </p>
              <p class="message">
                Please use the following OTP code to verify your email address:
              </p>
              <div class="otp-code">${otp}</div>
              <div class="warning">
                <strong>⚠️ Important:</strong><br>
                • This code will expire in <strong>10 minutes</strong><br>
                • Do not share this code with anyone<br>
                • If you didn't request this code, please ignore this email
              </div>
              <p class="message">
                Enter this code in the verification page to complete your registration.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
              <p>&copy; 2025 DCMS. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    const mailOptions = {
      from: `"DCMS" <${this.configService.get<string>('MAIL_USER')}>`,
      to: email,
      subject: 'Welcome to DCMS!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: white;
              margin: 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 30px;
            }
            .message {
              color: #4b5563;
              font-size: 16px;
              line-height: 1.8;
              margin: 15px 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to DCMS!</h1>
            </div>
            <div class="content">
              <p class="message">
                <strong>Congratulations!</strong> Your email has been verified successfully.
              </p>
              <p class="message">
                Your account is now active and you can start using all the features of our Dynamic Content Management System.
              </p>
              <p class="message">
                Thank you for joining us!
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2025 DCMS. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
