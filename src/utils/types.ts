import z from 'zod';
import { Result, CallToolRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export type ToolHandlers = Record<
  string,
  (request: z.infer<typeof CallToolRequestSchema>) => Promise<Result>
>;

export type ResourceHandlers = Record<
  string,
  (request: z.infer<typeof ReadResourceRequestSchema>) => Promise<Result>
>;