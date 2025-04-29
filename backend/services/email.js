import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log("Sending email to:", to, subject);

    const info = await transporter.sendMail({
      from: `"Pixel Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
};
