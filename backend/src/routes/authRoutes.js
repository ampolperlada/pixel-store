import express from 'express';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../services/email.js';
import User from '../models/User.js'; // Your User model

const router = express.Router();

// Request password reset link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    // 2. Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 3. Send email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ error: "Error processing request" });
  }
});

// Process password reset
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1. Find user by valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // 2. Update password
    user.password = newPassword; // Your model should hash this automatically
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // 3. Optional: Send confirmation email
    await sendEmail(user.email, "Password Changed", "Your password was updated successfully");

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }
});

export default router;