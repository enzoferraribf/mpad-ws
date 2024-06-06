// Y.js will report me to the police if I ever dare to use the import syntax instead of require.
const { setupWSConnection } = require('y-websocket/bin/utils')

import { buildServer } from './http/server'

import { buildWebSocket } from './ws/websocket'

import { buildHealthController } from './http/controllers/health-controller'

import { Program } from './program'

/**
 * Builds the main program with the `production` services
 * @returns The main program
 */
export const buildProgram = () => {
    const healthController = buildHealthController()

    const server = buildServer(healthController)
    const webSocket = buildWebSocket(server, setupWSConnection)

    const port = parseInt(process.env.PORT || '4000')
    const host = '0.0.0.0'

    const writeDocumentWorker = new Worker(new URL('./workers/save-document.ts', import.meta.url).href)

    return new Program(server, webSocket, writeDocumentWorker, { port, host })
}
