import { Router } from 'express';
import {
  llmCommandRequestSchema,
  llmCommandResponseSchema,
  llmCommandSchema,
  slideshowActionSchema,
} from '@photos-carousel/types';
import { getLastAction } from './slideshow.js';
import { mcpClient } from '../services/mcp-client.js';

export const llmRouter = Router();

llmRouter.post('/command', async (req, res) => {
  const parsed = llmCommandRequestSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const command = parsed.data.command;

  const action = slideshowActionSchema.safeParse(command.action);
  if (action.success) {
    await mcpClient.invoke('slideshow_control', { action: action.data });
    const response = llmCommandResponseSchema.parse({
      ok: true,
      action: action.data,
    });
    return res.json(response);
  }

  const result = await mcpClient.invoke('list_media_items', { sessionId: 'mock-session' });
  const response = llmCommandResponseSchema.parse({
    ok: true,
    action: command.action,
    detail: JSON.stringify(result),
  });
  return res.json(response);
});
