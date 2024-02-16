import http from 'http'
import WebSocket from 'ws'

import { setupWSConnection } from 'y-websocket/bin/utils'

export const buildWebSocket = (server: http.Server) => {
  const websocket = new WebSocket.Server({ server })

  websocket.on('connection', (connection, request) => {
    const documentName = request.url!.slice(1)

    setupWSConnection(connection, request, { gc: documentName !== 'ws/prosemirror-versions' })
  })

  return websocket
}
