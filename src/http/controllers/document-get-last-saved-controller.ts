import http from 'http'

import type { HttpController } from '.'

const CONTENT_TYPE_HEADERS = { 'Content-Type': 'application/json' }

export const buildDocumentLastSavedController = () => {
    /**
     * Deals with the client-side SWR requests for 'Last Saved' within a pad.
     * @param request - the incoming message
     * @param response - the server response
     *
     * @throws 400 - In case the pad parameter is not specified
     * @throws 404 - In case the pad is not found
     * @returns 200 - If the pad is found
     */
    const documentLastSavedController: HttpController = (request: http.IncomingMessage, response: http.ServerResponse) => {
        const url = new URL(request.url!)

        const pad = url.searchParams.get('pad')

        if (!pad) {
            response.writeHead(400, CONTENT_TYPE_HEADERS)
            response.end(JSON.stringify({ reason: 'Tried searching for status with empty `pad` parameter' }))
            return
        }

        // TODO: implement correct handling
        response.writeHead(200, CONTENT_TYPE_HEADERS)
        response.end(JSON.stringify({ lastSaved: 1708050788 }))
    }

    return documentLastSavedController
}
