import http from 'http'

import type { HttpController } from '.'

const CONTENT_TYPE_HEADERS = { 'Content-Type': 'application/json' }

export const buildHealthController = () => {
    /**
     * Deals with healthchecks.
     * @param request - the incoming message
     * @param response - the server response
     *
     * @returns 200
     */
    const healthCheckController: HttpController = (_: http.IncomingMessage, response: http.ServerResponse) => {
        response.writeHead(200, CONTENT_TYPE_HEADERS)
        response.end(JSON.stringify({ response: 'ok' }))
    }

    return healthCheckController
}
