import type { Operation } from '.'

export interface GetDocumentLastSaveRequest {
    /** The document identifier */
    name: string
}

export interface GetDocumentLastSaveResponse {
    lastSave: Date
}

/** Gets the last time that the given document was persisted in the storage layer */
export const GetDocumentLastSave: Operation<GetDocumentLastSaveRequest, GetDocumentLastSaveResponse> = async (request) => {
    // TODO: implement operation
    return Promise.resolve({ lastSave: new Date() })
}
