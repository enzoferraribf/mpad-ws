import type { Operation } from '.'

import { database } from '../database/pad'

export interface WriteDocumentRequest {
    /** The document identifier */
    name: string

    /** The data object representing the document's current state */
    document: any
}

export interface WriteDocumentResponse {
    name: string

    success: boolean

    reason?: string
}

export const buildWriteDocument = (encodeStateAsUpdateV2: (document: any) => Uint8Array) => {
    const cache = new Map<string, string>()

    /** Writes the given document version in the storage layer */
    const writeDocumentOperation: Operation<WriteDocumentRequest, WriteDocumentResponse> = async (request) => {
        const { name, document } = request

        const root = extractRoot(name)

        const text = document.getText('monaco').toString()

        if (cache.has(name) && cache.get(name) === text) return { name, success: true, reason: 'noop' }

        const content = encodeStateAsUpdateV2(document)

        const csvContent = content.join(',')

        const lastUpdate = Date.now()

        await database.execute({
            sql: 'INSERT INTO pads (id, content, root, last_update) VALUES ($id, $content, $root, $lastUpdate) ON CONFLICT DO UPDATE SET content = $content, root = $root, last_update = $lastUpdate',
            args: { id: name, content: csvContent, root: root, lastUpdate: lastUpdate },
        })

        cache.set(name, text)

        return { name, success: true, reason: 'success' }
    }

    const writeDocument: Operation<WriteDocumentRequest, WriteDocumentResponse> = async (request) => {
        return writeDocumentOperation(request)
            .then((response) => response)
            .catch((error) => ({ name: request.name, success: false, reason: error.message }))
    }

    return writeDocument
}

function extractRoot(name: string) {
    return '/' + name.split('/')[1]
}
