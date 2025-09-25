import { config } from 'dotenv';
import { oauthConfigSchema } from '@photos-carousel/types';

config();

const parsed = oauthConfigSchema.safeParse({
  clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/auth/callback',
  allowedOrigin: process.env.GOOGLE_ALLOWED_ORIGIN ?? 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET ?? 'change-me',
});

if (!parsed.success) {
  console.warn('Invalid OAuth configuration, using placeholders.');
}

export const oauthConfig = {
  clientId: parsed.success ? parsed.data.clientId : 'demo-client',
  clientSecret: parsed.success ? parsed.data.clientSecret : 'demo-secret',
  redirectUri: parsed.success ? parsed.data.redirectUri : 'http://localhost:3000/auth/callback',
  allowedOrigin: parsed.success ? parsed.data.allowedOrigin : 'http://localhost:5173',
  sessionSecret: parsed.success ? parsed.data.sessionSecret : 'change-me',
};
