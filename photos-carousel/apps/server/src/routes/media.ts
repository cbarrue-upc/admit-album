import { Router } from 'express';
import {
  listMediaItemsResponseSchema,
  mediaContentQuerySchema,
  mediaListQuerySchema,
} from '@photos-carousel/types';
import { generateMediaContentUrl, getSession, listSessionMedia } from '../services/picker.js';

export const mediaRouter = Router();

mediaRouter.get('/', (req, res) => {
  const parsed = mediaListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const session = getSession(parsed.data.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  const payload = listSessionMedia(parsed.data.sessionId);
  return res.json(listMediaItemsResponseSchema.parse(payload));
});

mediaRouter.get('/:id/content', (req, res) => {
  const parsed = mediaContentQuerySchema.safeParse({
    w: req.query.w ? Number(req.query.w) : undefined,
    h: req.query.h ? Number(req.query.h) : undefined,
    crop: req.query.crop,
  });
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const url = generateMediaContentUrl(req.params.id, parsed.data.w, parsed.data.h);
  res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(`mock-binary-for-${url}`);
});
