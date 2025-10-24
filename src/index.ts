#!/usr/bin/env node

import { MCPStreamableHttpServer } from './streamablehttp-server.js';
import { createServer } from './create-server.js';
import { log } from './utils/common/logging.js';

process.on('uncaughtException', (error) => {
    log.error(`Uncaught exception: [${error}]`);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    log.error(`Unhandled rejection: [${error}]`);
    process.exit(1);
});

export async function main() {
    log.info('Starting MCP server...');

    const server = await createServer();

    const mcpServer = new MCPStreamableHttpServer(server);
    await mcpServer.start();
}

await main();
