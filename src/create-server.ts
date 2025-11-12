import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequest, CallToolRequestSchema, ListResourcesRequest, ListResourcesRequestSchema, ListResourceTemplatesRequest, ListResourceTemplatesRequestSchema, ListToolsRequestSchema, ReadResourceRequest, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { log } from './utils/common/logging.js';
import { CALCULATOR_HANDLERS, CALCULATOR_RESOURCE_HANDLERS, CALCULATOR_RESOURCE_TEMPLATES, CALCULATOR_RESOURCES, CALCULATOR_TOOLS } from './tools/calculator.js';
import { version } from './utils/version.js';


export const createServer = async (): Promise<Server> => {
  const ALL_TOOLS = [
    ...CALCULATOR_TOOLS
  ];

  const ALL_HANDLERS = {
    ...CALCULATOR_HANDLERS
  };

  const ALL_RESOURCES = [
    ...CALCULATOR_RESOURCES
  ];

  // const ALL_RESOURCE_TEMPLATES = [
  //   ...CALCULATOR_RESOURCE_TEMPLATES
  // ]

  const server = new Server({ name: 'mcp-tools-apps', version }, { capabilities: { tools: {}, resources: {} } });


  // TOOLS HANDLERS
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    log.info('Received list tools request');
    return { tools: ALL_TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema,
    async (request: CallToolRequest) => {
      const toolName = request.params.name;
      log.info(`Received tool call: ${toolName}`);

      try {
        const handler = ALL_HANDLERS[toolName];
        if (!handler) {
          throw new Error(`Unknown tool: ${toolName}`);
        }
        return await handler(request);
      } catch (error) {
        log.error(`Error handling tool call: ${error}`);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });


  // RESOURCES HANDLERS
  server.setRequestHandler(ListResourcesRequestSchema,
    async (request: ListResourcesRequest) => {
      log.info('Received list resources request', request);
      return {
        resources: ALL_RESOURCES,
      };
    }
  );

  server.setRequestHandler(ReadResourceRequestSchema,
    async (request: ReadResourceRequest) => {

      const handler = CALCULATOR_RESOURCE_HANDLERS[request.params.uri];

      //const widget = widgetsByUri.get(request.params.uri);
      log.info(`Received resource read request: ${request.params.uri}`);
      if (!handler) {
        throw new Error(`Resource not found: ${request.params.uri}`);
      }
      return await handler(request);
    }
  );

  // server.setRequestHandler(ListResourceTemplatesRequestSchema,
  //   async (request: ListResourceTemplatesRequest) => {
  //     log.info('Received list resource templates request', request);
  //     return {
  //       resourceTemplates: ALL_RESOURCE_TEMPLATES,
  //     };
  //   }
  // );

  return server;
};
