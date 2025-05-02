// filepath: c:\pixel\pixel-store-web\app\lib\resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || '');