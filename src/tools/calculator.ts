import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { createToolResponse } from "../utils/utils.js";
import { ToolHandlers } from '../utils/types.js';

// Tool definitions
const GET_CALCULATOR: Tool = {
  name: 'get-calculator',
  description:
    'Get the result of a calculation based on the provided input',
  inputSchema: {
    type: 'object',
    properties: {
    },
  },
};

export const CALCULATOR_TOOLS = [
  GET_CALCULATOR
];

export const CALCULATOR_HANDLERS: ToolHandlers = {
  'get-calculator': async () => {

    const result = 42;

    return createToolResponse(result);
  },
};