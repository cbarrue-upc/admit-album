import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { oauthConfig } from './config/env.js';
import { pickerRouter } from './routes/picker.js';
import { mediaRouter } from './routes/media.js';
import { slideshowRouter } from './routes/slideshow.js';
import { llmRouter } from './routes/llm.js';
import { authRouter } from './routes/auth.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: oauthConfig.allowedOrigin,
    credentials: true,
  }),
);
app.use(
  session({
    secret: oauthConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
  }),
);

const pickerLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
});

const mediaLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
});

app.use('/auth', authRouter);
app.use('/picker', pickerLimiter, pickerRouter);
app.use('/media', mediaLimiter, mediaRouter);
app.use('/slideshow', slideshowRouter);
app.use('/llm', llmRouter);

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

export { app };
