import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // User is now authenticated with Google
  // Redirect to home page or dashboard
  res.redirect('/');
}