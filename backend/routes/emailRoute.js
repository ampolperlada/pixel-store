// routes/emailRoute.js
import express from 'express';
import { sendEmail } from '../services/email.js';

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  const result = await sendEmail(to, subject, html);

  if (result.success) {
    res.status(200).json({ message: 'Email sent successfully', data: result.data });
  } else {
    res.status(500).json({ message: 'Failed to send email', error: result.error });
  }
});

export default router;
