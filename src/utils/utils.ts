import { ToolResponse } from './common/schemas.js';

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
