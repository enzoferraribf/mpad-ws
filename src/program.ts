import http from 'http'
import WebSocket from 'ws'

const { encodeStateAsUpdateV2 } = require('yjs')

import type { WriteDocumentRequest } from './workers/save-document'

import { docs } from 'y-websocket/bin/utils'

export interface IProgramOptions {
    port: number
    host: string
}

export class Program {
    private readonly server: http.Server
    private readonly webSocket: WebSocket.Server
    private readonly writeDocumentWorker: Worker
    private readonly options: IProgramOptions

    /**
     * The main program
     * @param server The http server to receive requests
     * @param webSocket The webSocket attached to the http server
     * @param options The program configuration
     */
    constructor(server: http.Server, webSocket: WebSocket.Server, writeDocumentWorker: Worker, options: IProgramOptions) {
        this.server = server
        this.webSocket = webSocket
        this.writeDocumentWorker = writeDocumentWorker
        this.options = options
    }

    public run = () => {
        setInterval(this.autoSave, 5_000)

        this.server.listen(this.options.port, this.options.host)

        this.writeDocumentWorker.addEventListener('message', (message) => console.log(message))
    }

    private autoSave = async () => {
        const map = docs as Map<string, any>

        for (const [name, document] of map) {
            if (!name) continue

            const text = document.getText('monaco').toString()

            const state = encodeStateAsUpdateV2(document)

            const request: WriteDocumentRequest = { name, text, state }

            this.writeDocumentWorker.postMessage(request)
        }
    }
}
