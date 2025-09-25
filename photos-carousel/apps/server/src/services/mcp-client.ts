import { mcpServer } from './mcp-server.js';

class InProcessMCPClient {
  async invoke(toolName: string, args: unknown) {
    const handler = (mcpServer as any).getTool?.(toolName);
    if (!handler) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return handler(args);
  }
}

export const mcpClient = new InProcessMCPClient();
