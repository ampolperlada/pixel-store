import express from 'express';
import { sendEmail } from '../../services/email.js';

const router = express.Router();

// Add rate limiting specifically for emails
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 email requests per windowMs
  message: 'Too many email attempts, please try again later'
});

router.post('/send-email', emailLimiter, async (req, res) => {
  const { to, subject, html } = req.body;

  // Enhanced validation
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['to', 'subject', 'html']
    });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const result = await sendEmail(to, subject, html);
    if (result.success) {
      res.status(200).json({ 
        message: 'Email sent successfully',
        data: {
          to: result.data.accepted,
          messageId: result.data.messageId
        }
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send email',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

export default router;