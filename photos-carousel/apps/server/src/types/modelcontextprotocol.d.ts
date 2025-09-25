declare module '@modelcontextprotocol/sdk' {
  export interface MCPToolSpec {
    name: string;
    description: string;
    schema?: unknown;
  }

  export type MCPHandler = (args: any) => Promise<unknown> | unknown;

  export class MCPServer {
    constructor(config: { name: string });
    registerTool(spec: MCPToolSpec, handler: MCPHandler): void;
    getTool(name: string): MCPHandler | undefined;
  }
}
