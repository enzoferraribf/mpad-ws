import { buildServer } from './http/server'

import { buildWebSocket } from './ws/websocket'

import { buildHealthController } from './http/controllers/health-controller'
import { buildDocumentLastSavedController } from './http/controllers/document-get-last-saved-controller'

import { Program } from './program'

/**
 * Builds the main program with the `production` services
 * @returns The main program
 */
export const buildProgram = () => {
    const healthController = buildHealthController()
    const documentLastSavedController = buildDocumentLastSavedController()

    const server = buildServer(healthController, documentLastSavedController)
    const webSocket = buildWebSocket(server)

    const port = parseInt(process.env.PORT || '4000')
    const host = '0.0.0.0'

    return new Program(server, webSocket, { port, host })
}
