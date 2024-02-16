import http from 'http'

import { type HttpController } from './controllers'

export const buildServer = (healthController: HttpController, documentLastSavedController: HttpController) => {
    return http.createServer((request, response) => {
        const url = new URL(request.url!)

        if (url.pathname === 'health') return healthController(request, response)
        if (url.pathname === 'document/getLastSaved') return documentLastSavedController(request, response)
    })
}
