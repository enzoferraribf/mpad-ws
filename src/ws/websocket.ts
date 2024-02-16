import http from 'http'
import WebSocket from 'ws'

import { setupWSConnection } from 'y-websocket/bin/utils'

/**
 * Builds the document communication websocket. This is based on the
 * Y.js demo server: https://github.com/yjs/yjs-demos/blob/main/demo-server/demo-server.js.
 */
export const buildWebSocket = (server: http.Server) => {
    const websocket = new WebSocket.Server({ server })

    websocket.on('connection', (connection, request) => {
        const documentName = request.url!.slice(1)

        setupWSConnection(connection, request, { gc: documentName !== 'ws/prosemirror-versions' })
    })

    return websocket
}
