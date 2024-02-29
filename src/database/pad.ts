import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING!)

const database = client.database('mpad')

const container = database.container('pads')

export { container }
