"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
const fastify_1 = __importDefault(require("fastify"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
dotenv_flow_1.default.config();
const host = process.env.HOST;
(0, tiny_invariant_1.default)(typeof host === 'string');
const port = Number(process.env.PORT);
(0, tiny_invariant_1.default)(typeof port === 'number');
const server = (0, fastify_1.default)({
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
});
server.get('/', async () => {
    return {
        hello: 'world'
    };
});
server.get('/info/routes', async () => {
    return server.printRoutes();
});
async function start() {
    try {
        console.log(`http://localhost:${port}`);
        await server.listen({
            port,
            host,
        });
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}
start();
