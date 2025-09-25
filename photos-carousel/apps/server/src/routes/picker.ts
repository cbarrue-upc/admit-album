import { Router } from 'express';
import {
  pickerSessionCreateBodySchema,
  pickerSessionResponseSchema,
  pickerSessionStateSchema,
} from '@photos-carousel/types';
import { createPickerSession, getSession } from '../services/picker.js';

export const pickerRouter = Router();

pickerRouter.post('/session', (req, res) => {
  const parsed = pickerSessionCreateBodySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const session = createPickerSession();
  return res.json(pickerSessionResponseSchema.parse(session));
});

pickerRouter.get('/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  return res.json(
    pickerSessionStateSchema.parse({
      mediaItemsSet: session.status === 'READY',
      pollingConfig: { pollAfter: 4 },
    }),
  );
});
