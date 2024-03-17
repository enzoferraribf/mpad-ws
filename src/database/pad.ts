import { createClient } from '@libsql/client'

const turso = createClient({ url: process.env.TURSO_DB!, authToken: process.env.TURSO_TOKEN! })

export const database = turso
