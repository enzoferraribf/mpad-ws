import { runServer } from './http/server'

/**
 * Builds the main program with the `production` services
 * @returns The main program
 */
export const runProgram = () => {
    const timeout = 30
    const payload = 1024 * 16

    const port = parseInt(process.env.PORT || '4000')
    const host = '0.0.0.0'

    runServer({ timeout, payload, host, port })

    console.log(`Listening on host ${host}, port ${port}`)
}
