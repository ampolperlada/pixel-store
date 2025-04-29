import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Email configuration validator
const validateEmailConfig = () => {
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing email configuration: ${missingVars.join(', ')}`);
  }
};

// HTML content sanitizer (basic example)
const sanitizeHtml = (html) => {
  // In production, use a proper library like DOMPurify
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Transport connection tester
const testTransport = async (transporter) => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const subject = "Password Reset Request";
  const html = `
    <p>You requested a password reset for your Pixel Store account.</p>
    <p>Click this link to reset your password (expires in 1 hour):</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return sendEmail(email, subject, html);
};

export const sendEmail = async (to, subject, html) => {
  try {
    // Validate configuration first
    validateEmailConfig();

    // Create transporter with enhanced options
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // Auto-detect SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development'
    });

    

    // Test connection before sending
    if (!await testTransport(transporter)) {
      throw new Error("SMTP connection verification failed");
    }

    // Sanitize HTML content
    const safeHtml = sanitizeHtml(html);

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📝 Subject: ${subject}`);

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Pixel Store'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: safeHtml,
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'PixelStore/1.0'
      }
    });

    console.log("✅ Message sent. ID:", info.messageId);
    console.log("📤 Accepted recipients:", info.accepted);
    if (info.rejected.length > 0) {
      console.warn("❌ Rejected recipients:", info.rejected);
    }

    return { 
      success: true, 
      data: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      }
    };
  } catch (error) {
    console.error("❌ Email send failed:", {
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      recipient: to,
      timestamp: new Date().toISOString()
    });

    return { 
      success: false, 
      error: {
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { details: error.stack })
      }
    };
  }
};