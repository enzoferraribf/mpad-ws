import { encodeStateAsUpdateV2, type Doc } from 'yjs'

import type { Operation } from '.'

import type { Pad } from '../models/Pad'

import { container } from '../database/pad'

export interface WriteDocumentRequest {
    /** The document identifier */
    name: string

    /** The data object representing the document's current state */
    document: Doc
}

export interface WriteDocumentResponse {
    name: string

    success: boolean

    reason?: string
}

const cache = new Map<string, Array<number>>()

/** Writes the given document version in the storage layer */
const writeDocumentOperation: Operation<WriteDocumentRequest, WriteDocumentResponse> = async (request) => {
    const { name, document } = request

    const root = extractRoot(name)

    const version = Array.from(encodeStateAsUpdateV2(document))

    if (cache.has(name) && cache.get(name)!.every((value, index) => value === version[index])) {
        return { name, success: true, reason: 'no changes' }
    }

    type PadUpsert = Omit<Pad, '_ts'>

    const changeset: PadUpsert = {
        root,
        document: name,
        content: version,
    }

    const sql = 'SELECT c.id, c.versions FROM c WHERE c.document = @document'

    const query = {
        query: sql,
        parameters: [
            {
                name: '@document',
                value: name,
            },
        ],
    }

    type Container = Pick<Pad, 'id'>

    const feed = await container.items.query<Container>(query).fetchAll()

    const hasAnyResult = feed.resources && feed.resources.length > 0

    if (hasAnyResult) {
        const [{ id }] = feed.resources

        changeset.id = id
    }

    await container.items.upsert<PadUpsert>(changeset)

    cache.set(name, version)

    return { name, success: true, reason: 'success' }
}

export const writeDocument: Operation<WriteDocumentRequest, WriteDocumentResponse> = async (request) => {
    return writeDocumentOperation(request)
        .then((response) => response)
        .catch((error) => ({ name: request.name, success: false, reason: error.message }))
}

function extractRoot(name: string) {
    return '/' + name.split('/')[1]
}
