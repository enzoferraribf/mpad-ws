export interface IDocumentVersion {
    /** The encoded changes in this version */
    changes: Array<number>

    /** When this change was created */
    createdAt: Date
}
