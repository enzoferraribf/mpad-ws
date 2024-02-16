import http from 'http'
import WebSocket from 'ws'

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
        this.server.listen(this.options.port, this.options.host)
    }
}
