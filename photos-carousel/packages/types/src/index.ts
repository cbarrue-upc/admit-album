import { z } from 'zod';

export const GOOGLE_PHOTOS_PICKER_SCOPE =
  'https://www.googleapis.com/auth/photospicker.mediaitems.readonly';

export const BASE_URL_TTL_MINUTES = 60;
export const BASE_URL_REFRESH_THRESHOLD_MINUTES = 55;

export const slideshowActionSchema = z.enum(['PLAY', 'PAUSE', 'NEXT', 'PREV', 'SHUFFLE']);
export type SlideshowAction = z.infer<typeof slideshowActionSchema>;

export const llmCommandSchema = z.object({
  action: z.union([
    slideshowActionSchema,
    z.literal('OPEN_PICKER'),
    z.literal('APPLY_FILTERS'),
    z.literal('LIST'),
  ]),
  filters: z
    .object({
      orientation: z.enum(['portrait', 'landscape']).optional(),
      mime: z.array(z.string()).optional(),
      dateRange: z
        .object({
          from: z.string().datetime({ offset: true }).optional(),
          to: z.string().datetime({ offset: true }).optional(),
        })
        .partial()
        .optional(),
    })
    .optional(),
});
export type LLMCommand = z.infer<typeof llmCommandSchema>;

export const pickerFilterSchema = z
  .object({
    orientation: z.enum(['portrait', 'landscape']).optional(),
    mime: z.array(z.string()).optional(),
    dateRange: z
      .object({
        from: z.string().datetime({ offset: true }).optional(),
        to: z.string().datetime({ offset: true }).optional(),
      })
      .partial()
      .optional(),
  })
  .optional();

export const pickerSessionResponseSchema = z.object({
  sessionId: z.string(),
  pickerUri: z.string().url(),
});

export const pickerSessionStateSchema = z.object({
  mediaItemsSet: z.boolean(),
  pollingConfig: z
    .object({
      pollAfter: z.number().optional(),
    })
    .partial()
    .optional(),
});

export const mediaItemSchema = z.object({
  id: z.string(),
  mimeType: z.string(),
  baseUrl: z.string().url().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  creationTime: z.string().datetime().optional(),
});

export const listMediaItemsResponseSchema = z.object({
  items: z.array(mediaItemSchema),
  nextCursor: z.string().optional(),
});

export const slideshowControlSchema = z.object({
  action: slideshowActionSchema,
});

export const applyFiltersSchema = z.object({
  orientation: z.enum(['portrait', 'landscape']).optional(),
  mime: z.array(z.string()).optional(),
});

export const llmCommandResponseSchema = z.object({
  ok: z.boolean(),
  action: z.string(),
  detail: z.string().optional(),
});

export const pickerSessionCreateBodySchema = z.object({
  filters: pickerFilterSchema,
});

export const mediaListQuerySchema = z.object({
  sessionId: z.string(),
  cursor: z.string().optional(),
});

export const mediaContentQuerySchema = z.object({
  w: z.number().int().positive().optional(),
  h: z.number().int().positive().optional(),
  crop: z.enum(['c']).optional(),
});

export const llmCommandRequestSchema = z.object({
  command: llmCommandSchema,
});

export const oauthConfigSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  allowedOrigin: z.string().url(),
  sessionSecret: z.string(),
});

export type PickerSessionResponse = z.infer<typeof pickerSessionResponseSchema>;
export type PickerSessionState = z.infer<typeof pickerSessionStateSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;
export type ListMediaItemsResponse = z.infer<typeof listMediaItemsResponseSchema>;
export type LLMCommandResponse = z.infer<typeof llmCommandResponseSchema>;
