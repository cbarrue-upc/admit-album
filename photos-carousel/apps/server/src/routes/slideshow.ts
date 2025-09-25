import { Router } from 'express';
import { slideshowActionSchema, slideshowControlSchema } from '@photos-carousel/types';

let lastAction: string | null = null;

export const slideshowRouter = Router();

slideshowRouter.post('/control', (req, res) => {
  const parsed = slideshowControlSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  lastAction = parsed.data.action;
  return res.json({ ok: true, action: parsed.data.action });
});

export function getLastAction() {
  return lastAction ? slideshowActionSchema.parse(lastAction) : null;
}
