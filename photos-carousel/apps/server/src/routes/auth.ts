import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (_req, res) => {
  res.json({ url: 'https://accounts.google.com/o/oauth2/v2/auth' });
});

authRouter.get('/callback', (_req, res) => {
  res.send('OAuth callback placeholder');
});
