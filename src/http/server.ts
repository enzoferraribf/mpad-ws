import type { Server, ServerWebSocket } from 'bun'

import type { IServerOptions } from '../models/server'

import { WebSocketState, type RTCData } from '../models/socket'

/** Builds an HTTP/Websocket server. */
export const runServer = ({ payload, timeout, host, port }: IServerOptions) => {
    const HEALTH_RESPONSE = JSON.stringify({ response: 'ok' })

    const CONTENT_TYPE_HEADERS = { 'Content-Type': 'application/json' }

    const connections = new Map<string, Set<ServerWebSocket<unknown>>>()

    const topics = new Set<string>()

    // Send back a pong when a ping is received. This ensures that the connection is alive.
    function onPingMessage(connection: ServerWebSocket<unknown>) {
        send(connection, { type: 'pong' } as any)
    }

    // Broadcast message to all clients connected to the given message topic.
    function onPublishMessage(message: RTCData) {
        if (!message.topic) return

        const subscriptions = connections.get(message.topic)

        if (!subscriptions) return

        message.clients = subscriptions.size

        for (const subscription of subscriptions) {
            send(subscription, message)
        }
    }

    // Unsubscribe the current connection for the given topics.
    function onUnsubscribeMessage(message: RTCData, connection: ServerWebSocket<unknown>) {
        for (const topic of message.topics || []) {
            const subscriptions = connections.get(topic)

            if (subscriptions) {
                subscriptions.delete(connection)
            }
        }
    }

    // Subscribe the current connection for the given topics
    function onSubscribeMessage(message: RTCData, connection: ServerWebSocket<unknown>) {
        for (const topic of message.topics || []) {
            const subscriptions = connections.get(topic) ?? new Set<ServerWebSocket<unknown>>()

            subscriptions.add(connection)

            connections.set(topic, subscriptions)

            topics.add(topic)
        }
    }

    // Send data down the wire.
    const send = (connection: ServerWebSocket<unknown>, message: RTCData) => {
        if (connection.readyState !== WebSocketState.CONNECTING && connection.readyState !== WebSocketState.OPEN) {
            connection.close()
        }

        try {
            connection.send(JSON.stringify(message))
        } catch {
            // If we can't signal a connection, just close it and let the client retry
            connection.close()
        }
    }

    function onFetch(request: Request, server: Server) {
        if (server.upgrade(request)) {
            return
        }

        const url = new URL(request.url)

        if (url.pathname === 'health') return new Response(HEALTH_RESPONSE, { headers: CONTENT_TYPE_HEADERS, status: 200 })

        return new Response('Upgrade failed', { status: 500 })
    }

    // Appropriatelly handle each type of message.
    function onMessage(connection: ServerWebSocket<unknown>, message: string | Buffer) {
        const parsed = JSON.parse(message.toString()) as RTCData

        if (!parsed || !parsed.type) return

        switch (parsed.type) {
            case 'subscribe':
                onSubscribeMessage(parsed, connection)
                break

            case 'unsubscribe':
                onUnsubscribeMessage(parsed, connection)
                break

            case 'publish':
                onPublishMessage(parsed)
                break
            case 'ping':
                onPingMessage(connection)
                break
        }
    }

    // Clear entries for subscriptions and topics for the given alive connection.
    function onClose(connection: ServerWebSocket<unknown>) {
        for (const topic of topics) {
            const subscriptions = connections.get(topic)

            if (subscriptions) {
                subscriptions.delete(connection)

                if (subscriptions.size === 0) {
                    connections.delete(topic)
                }
            }
        }

        topics.clear()
    }

    Bun.serve({
        fetch: onFetch,

        websocket: {
            maxPayloadLength: payload,

            idleTimeout: timeout,

            message: onMessage,

            close: onClose,
        },

        hostname: host,

        port: port,
    })
}
