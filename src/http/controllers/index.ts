import http from 'http'

export type HttpController = (request: http.IncomingMessage, response: http.ServerResponse) => void
