// routes/emailRoute.js
import express from 'express';
import { sendEmail } from '../services/email.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await sendEmail(to, subject, html);
    if (result.success) {
      res.status(200).json({ message: 'Email sent successfully', data: result.data });
    } else {
      res.status(500).json({ error: 'Failed to send email', details: result.error });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
