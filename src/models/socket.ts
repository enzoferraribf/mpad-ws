import http from 'http'

export enum WebSocketState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export type RTCData = http.IncomingMessage & {
    type: string
    topics: string[]
    topic: string
    clients: number
}
