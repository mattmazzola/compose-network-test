import { CommunicationProtocolEnum, DaprClient, HttpMethod } from '@dapr/dapr'
import fastifyCors from "@fastify/cors"
import dotenv from "dotenv-flow"
import fastify from "fastify"
import invariant from 'tiny-invariant'

dotenv.config() 

const HOST = process.env.HOST
invariant(typeof HOST === 'string', `Environment variable HOST is not defined`)
const PORT = Number(process.env.PORT)
invariant(typeof PORT === 'number', `Environment variable PORT is not defined`)

const DAPR_HOST = process.env.DAPR_HOST ?? "http://localhost"
invariant(typeof DAPR_HOST === 'string', `Environment variable DAPR_HOST is not defined`)

const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT ?? "3500"
invariant(typeof DAPR_HTTP_PORT === 'string', `Environment variable DAPR_HTTP_PORT is not defined`)
const daprClient = new DaprClient(DAPR_HOST, DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP)

console.log({
    info: {
        listening: `${HOST}:${PORT}`,
        dapr: `${DAPR_HOST}:${DAPR_HTTP_PORT}`,
    }
})

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                destination: 1
            }
        }
        // redact: ['req.headers.authorization'],
    },
    caseSensitive: false,
})

server.register(fastifyCors)

server.get('/', async () => {
    return `API Server running... ${new Date().toLocaleString('en-us', { dateStyle: 'full'})}`
})

server.get('/counter', async () => {
    const counterFromDbDaprClient = await daprClient.invoker.invoke('db', 'counter', HttpMethod.GET)

    return {
        ...(counterFromDbDaprClient as object),
        source: 'api'
    }
})

server.get('/info/routes', async () => {
    return server.printRoutes()
})

async function start() {
    try {
        console.log(`http://localhost:${PORT} `)
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
