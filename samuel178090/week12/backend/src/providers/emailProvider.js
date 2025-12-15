/**
 * Real Email Provider - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const nodemailer = require('nodemailer');

class EmailProvider {
  constructor() {
    // Configure with your email service
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // or 'outlook', 'yahoo', etc.
      auth: {
        user: process.env.EMAIL_USER, // your-email@gmail.com
        pass: process.env.EMAIL_PASS  // your-app-password
      }
    });
  }

  async send(recipient, subject, message, metadata) {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject || 'WaveCom Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">📧 WaveCom Notification</h2>
            <p>${message}</p>
            <hr style="margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 12px;">
              Sent by Samuel Ajewole's WaveCom Notification System<br>
              Software Engineering Week 12 Challenge
            </p>
          </div>
        `
      });

      return {
        success: true,
        messageId: result.messageId,
        provider: 'nodemailer'
      };
    } catch (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = new EmailProvider();