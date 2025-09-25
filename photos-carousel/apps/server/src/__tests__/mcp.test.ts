import { describe, expect, it } from 'vitest';
import { mcpServer } from '../services/mcp-server.js';

const server: any = mcpServer;

describe('MCP server tools', () => {
  it('registers and resolves tools', async () => {
    const tool = server.getTool('open_picker');
    expect(tool).toBeTypeOf('function');
    const result = await tool({});
    expect(result).toHaveProperty('sessionId');
  });
});
