import http from 'http'
import WebSocket from 'ws'

import type { Doc } from 'yjs'
import { docs } from 'y-websocket/bin/utils'

import { writeDocument, type WriteDocumentRequest, type WriteDocumentResponse } from './operations/write-document'

export interface IProgramOptions {
    port: number
    host: string
}

export class Program {
    private readonly server: http.Server
    private readonly webSocket: WebSocket.Server
    private readonly options: IProgramOptions

    /**
     * The main program
     * @param server The http server to receive requests
     * @param webSocket The webSocket attached to the http server
     * @param options The program configuration
     */
    constructor(server: http.Server, webSocket: WebSocket.Server, options: IProgramOptions) {
        this.server = server
        this.webSocket = webSocket
        this.options = options
    }

    public run() {
        setInterval(this.autoSave, 5_000)

        this.server.listen(this.options.port, this.options.host)
    }

    private async autoSave() {
        const map = docs as Map<string, Doc>

        const promises: Promise<WriteDocumentResponse>[] = new Array(map.size)

        for (const [name, document] of map) {
            if (!name) continue

            const request: WriteDocumentRequest = { name, document }

            const promise = writeDocument(request)

            promises.push(promise)
        }

        const responses = await Promise.all(promises)

        for (const response of responses) {
            if (!response) continue

            console.log(`Request for document: ${response?.name} has succeed: ${response?.success} with reason: ${response?.reason}`)
        }
    }
}
