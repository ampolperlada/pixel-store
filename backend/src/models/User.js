import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String, // Hashed password
    googleId: String, // For Google OAuth
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
