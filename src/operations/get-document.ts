import type { Operation } from '.'

import type { IDocumentVersion } from '../models/document-version'

export interface GetDocumentRequest {
    /** The document identifier */
    name: string
}

export interface GetDocumentResponse {
    /** The document identifier */
    name: string

    /** All the versions for this document, sorted by creation timestamp */
    versions: IDocumentVersion[]
}

/** Gets the given document from the storage layer */
export const GetDocument: Operation<GetDocumentRequest, GetDocumentResponse> = async (request) => {
    // TODO: implement operation
    return Promise.resolve({ name: 'foo', versions: [] })
}
