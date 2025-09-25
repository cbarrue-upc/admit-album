import axios from 'axios';
import type {
  LLMCommand,
  ListMediaItemsResponse,
  PickerSessionResponse,
  PickerSessionState,
} from '@photos-carousel/types';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function createPickerSession(filters?: LLMCommand['filters']): Promise<PickerSessionResponse> {
  const response = await client.post<PickerSessionResponse>('/picker/session', { filters });
  return response.data;
}

export async function getPickerSessionState(sessionId: string): Promise<PickerSessionState> {
  const response = await client.get<PickerSessionState>(`/picker/session/${sessionId}`);
  return response.data;
}

export async function listMediaItems(
  sessionId: string,
  cursor?: string,
): Promise<ListMediaItemsResponse> {
  const response = await client.get<ListMediaItemsResponse>('/media', {
    params: { sessionId, cursor },
  });
  return response.data;
}

export async function controlSlideshow(action: string) {
  await client.post('/slideshow/control', { action });
}

export async function sendLLMCommand(command: LLMCommand) {
  const response = await client.post('/llm/command', { command });
  return response.data;
}
