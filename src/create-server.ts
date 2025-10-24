import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { log } from './utils/common/logging.js';


export const createServer = async (): Promise<Server> => {
    const ALL_TOOLS: never[] = [

    ];

    const ALL_HANDLERS = {

    };

    const server = new Server({ name: 'mcp-tools-apps', __APP_VERSION__ }, { capabilities: { tools: {} } });

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        log.info('Received list tools request');
        return { tools: ALL_TOOLS };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const toolName = request.params.name;
        log.info('Received tool call:', toolName);

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

    return server;
};
