// src/routes/emailRoute.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendEmail } from '../../services/email.js';
// Or import from your rate limit middleware
// import { apiLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Email-specific rate limiter
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 email requests per hour
  message: 'Too many email requests from this IP, please try again after an hour'
});

// Apply rate limiter to all routes in this file
router.use(emailLimiter);

// Route to send a contact form email
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    await sendEmail(
      process.env.CONTACT_EMAIL, // Your contact email address
      `Contact Form: ${subject}`,
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    );
    
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

export default router;