import http from 'http'

import { type HttpController } from './controllers'

/** Builds an HTTP server that answers for the given controllers. */
export const buildServer = (healthController: HttpController, getDocumentLastSavedController: HttpController) => {
    return http.createServer((request, response) => {
        const url = new URL(request.url!)

        if (url.pathname === 'health') return healthController(request, response)
        if (url.pathname === 'document/getLastSaved') return getDocumentLastSavedController(request, response)
    })
}
