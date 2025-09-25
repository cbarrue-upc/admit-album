import { MCPServer as BaseMCPServer } from '@modelcontextprotocol/sdk';
import { z } from 'zod';
import {
  applyFiltersSchema,
  listMediaItemsResponseSchema,
  mediaItemSchema,
  pickerSessionResponseSchema,
  pickerSessionStateSchema,
  slideshowControlSchema,
} from '@photos-carousel/types';
import {
  createPickerSession,
  generateMediaContentUrl,
  getSession,
  listSessionMedia,
} from './picker.js';

class LocalMCPServer extends (BaseMCPServer as { new (config: { name: string }): any }) {
  private tools = new Map<string, (args: unknown) => unknown>();

  registerTool(spec: { name: string; description: string }, handler: (args: unknown) => unknown) {
    this.tools.set(spec.name, handler);
  }

  getTool(name: string) {
    return this.tools.get(name);
  }
}

const server = new LocalMCPServer({ name: 'photos-carousel-mcp' });

server.registerTool(
  {
    name: 'open_picker',
    description: 'Crea una nueva sesión de Google Photos Picker',
  },
  async (args) => {
    const filters = applyFiltersSchema.optional().parse(args?.filters);
    const session = createPickerSession();
    return pickerSessionResponseSchema.parse(session);
  },
);

server.registerTool(
  {
    name: 'poll_session',
    description: 'Obtiene el estado de una sesión de Picker',
  },
  async (args) => {
    const schema = z.object({ sessionId: z.string() });
    const input = schema.parse(args);
    const session = getSession(input.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return pickerSessionStateSchema.parse({
      mediaItemsSet: session.status === 'READY',
      pollingConfig: { pollAfter: 4 },
    });
  },
);

server.registerTool(
  {
    name: 'list_media_items',
    description: 'Lista los elementos seleccionados en una sesión de Picker',
  },
  async (args) => {
    const schema = z.object({ sessionId: z.string(), pageToken: z.string().optional() });
    const input = schema.parse(args);
    const payload = listSessionMedia(input.sessionId);
    return listMediaItemsResponseSchema.parse(payload);
  },
);

server.registerTool(
  {
    name: 'get_image_blob',
    description: 'Obtiene el blob de una imagen',
  },
  async (args) => {
    const schema = z.object({
      mediaItemId: z.string(),
      w: z.number().optional(),
      h: z.number().optional(),
      crop: z.string().optional(),
    });
    const input = schema.parse(args);
    const url = generateMediaContentUrl(input.mediaItemId, input.w, input.h);
    return { mimeType: 'image/jpeg', url };
  },
);

server.registerTool(
  {
    name: 'slideshow_control',
    description: 'Controla el carrusel',
  },
  async (args) => {
    const input = slideshowControlSchema.parse(args);
    return { ok: true, action: input.action };
  },
);

export const mcpServer = server;
