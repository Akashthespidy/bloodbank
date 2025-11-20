import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

export async function sendContactRequestEmail(
  donorEmail: string,
  donorName: string,
  requesterName: string,
  bloodGroup: string,
  area: string
) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: donorEmail,
    subject: 'Blood Donation Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🩸 Blood Donation Request</h2>
        <p>Hello ${donorName},</p>
        <p>Someone is looking for blood donation and would like to contact you.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Request Details:</h3>
          <p><strong>Requester:</strong> ${requesterName}</p>
          <p><strong>Blood Group Needed:</strong> ${bloodGroup}</p>
          <p><strong>Location:</strong> ${area}</p>
        </div>
        <p>Please check your blood bank account to approve or reject this contact request.</p>
        <p>Thank you for being a lifesaver! ❤️</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is an automated message from the Blood Bank Management System.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
} 