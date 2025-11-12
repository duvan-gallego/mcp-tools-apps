import { z } from 'zod';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export interface ToolResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  _meta?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ToolUiResponse {
  contents: Array<{ uri: string; mimeType: string; text: string, _meta?: Record<string, unknown> }>;
  isError?: boolean;
  [key: string]: unknown;
}

export type ToolRequest = z.infer<typeof CallToolRequestSchema>;
