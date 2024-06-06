const { encodeStateAsUpdateV2 } = require('yjs')

import { database } from '../database/pad'

declare var self: Worker

export interface WriteDocumentRequest {
    /** The document identifier */
    name: string

    /** The data object representing the document's current state */
    text: string

    state: Array<number>
}

const cache = new Map<string, string>()

self.onmessage = async (event: MessageEvent<WriteDocumentRequest>) => {
    try {
        const { name, text, state } = event.data

        const root = extractRoot(name)

        if (cache.has(name) && cache.get(name) === text) {
            postMessage({ name, success: true, reason: 'noop' })
            return
        }

        const csvContent = state.join(',')

        const lastUpdate = Date.now()

        console.log(lastUpdate)

        await database.execute({
            sql: 'INSERT INTO pads (id, content, root, last_update) VALUES ($id, $content, $root, $lastUpdate) ON CONFLICT DO UPDATE SET content = $content, root = $root, last_update = $lastUpdate',
            args: { id: name, content: csvContent, root: root, lastUpdate: lastUpdate },
        })

        cache.set(name, text)

        postMessage({ name, success: true, reason: 'success' })
    } catch (error) {
        postMessage({ name: event.data.name, success: false, reason: error })
    }
}

function extractRoot(name: string) {
    return '/' + name.split('/')[1]
}
