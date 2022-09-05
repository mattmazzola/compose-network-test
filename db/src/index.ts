import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr'
import fastifyCors from "@fastify/cors"
import dotenv from "dotenv-flow"
import fastify from "fastify"
import invariant from 'tiny-invariant'

dotenv.config()

const HOST = process.env.HOST
invariant(typeof HOST === 'string')

const PORT = Number(process.env.PORT)
invariant(typeof PORT === 'number')

const DAPR_HOST = process.env.DAPR_HOST ?? "http://localhost"
invariant(typeof DAPR_HOST === 'string', `Environment variable DAPR_HOST is not defined`)

const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT ?? "3500"
invariant(typeof DAPR_HTTP_PORT === 'string', `Environment variable DAPR_HTTP_PORT is not defined`)
const daprClient = new DaprClient(DAPR_HOST, DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP)

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                destination: 1
            }
        }
    },
    caseSensitive: false,
})

server.register(fastifyCors)

server.get('/', async () => {
    return `DB Server running... ${new Date().toLocaleString('en-us', { dateStyle: 'full'})}`
})

const counterKey = 'counter'
const DAPR_STATE_STORE_NAME = "statestore"

server.get('/counter', async () => {
    const daprClient = new DaprClient(DAPR_HOST, DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP)

    let savedCounter = await daprClient.state.get(DAPR_STATE_STORE_NAME, counterKey);
    let savedCounterValue: number | undefined
    if (typeof savedCounter === 'object') {
        savedCounterValue = Number(savedCounter.value)
    }
    else if (typeof savedCounter === 'string') {
        savedCounterValue = Number(savedCounter)
    }
    else if (typeof savedCounter === 'number') {
        savedCounterValue = savedCounter
    }
    else {
        savedCounterValue = 1
    }
    
    console.log('Existing counter value', { savedCounterValue })
    
    let newCounterValue = savedCounterValue
    newCounterValue++
    
    const newState = [
        {
            key: counterKey,
            value: newCounterValue,
        }
    ]

    console.log('Attempt to save', { newState })
    await daprClient.state.save(DAPR_STATE_STORE_NAME, newState)

    savedCounter = await daprClient.state.get(DAPR_STATE_STORE_NAME, counterKey)
    console.log('Saved counter value', { savedCounter })

    return {
        counter: savedCounter,
        source: 'db',
    }
})

server.get('/info/routes', async () => {
    return server.printRoutes()
})

async function start() {
    try {
        await server.listen({
            port: PORT,
            host: HOST,
        })
    } catch (error) {
        server.log.error(error)
        process.exit(1)
    }
}

start()
