import { Resend } from 'resend';

console.log('Resend API Key:', process.env.RESEND_API_KEY); // Add this line for debugging

export const resend = new Resend(process.env.RESEND_API_KEY || '');