import { boolean } from 'zod/v4';
import { ToolResponse, ToolUiResponse } from './common/schemas.js';

export function createToolResponse(data: unknown, isError = false): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data),
      },
    ],
    isError,
    _meta: {},
  };
}

export function createUIToolResponse({
  text, uri, meta, isError = false
}: { text: string, uri: string, meta?: Record<string, unknown>, isError?: boolean }): ToolUiResponse {
  return {
    contents: [
      {
        uri,
        mimeType: "text/html+skybridge",
        text: text.trim(),
        _meta: meta
      },
    ],
    isError,
  };
}