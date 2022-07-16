import dotenv from "dotenv-flow"
import fastify from "fastify"
import invariant from 'tiny-invariant'

dotenv.config()

const host = process.env.HOST
invariant(typeof host === 'string')

const port = Number(process.env.PORT)
invariant(typeof port === 'number')

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

server.get('/', async () => {
    return {
        hello: 'world'
    }
})

server.get('/info/routes', async () => {
    return server.printRoutes()
})

async function start() {
    try {
        console.log(`http://localhost:${port}`)
        await server.listen({
            port,
            host,
        })
    } catch (error) {
        server.log.error(error)
        process.exit(1)
    }
}

start()
