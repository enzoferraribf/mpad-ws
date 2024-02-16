import type { Doc } from 'yjs'

import type { Operation } from '.'

export interface WriteDocumentRequest {
    /** The document identifier */
    name: string

    /** The data object representing the document's current state */
    document: Doc
}

export interface WriteDocumentResponse {}

/** Writes the given document version in the storage layer */
export const writeDocument: Operation<WriteDocumentRequest, WriteDocumentResponse> = async (request) => {
    // TODO: implement operation
    return Promise.resolve({})
}
