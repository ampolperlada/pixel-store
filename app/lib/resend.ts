import { Resend } from 'resend';

// Only initialize if we have an API key
const apiKey = process.env.RESEND_API_KEY;
console.log('Resend API Key available:', !!apiKey); 

export const resend = apiKey ? new Resend(apiKey) : null;