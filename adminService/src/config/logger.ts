import winston from 'winston'
import LokiTransport from 'winston-loki'

const lokiUrl = process.env.LOKI_URL ?? 'http://loki:3100'

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'village-admin-backend'

export const logger = winston.createLogger({
    level: 'info',

    format: winston.format.combine(
        winston.format.timestamp()
    ),

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),

        new LokiTransport({
            host: lokiUrl,
            labels: { service: serviceName },
            json: true,
            format: winston.format.json(),
            replaceTimestamp: true,
            onConnectionError: (err) => console.error('Loki connection error:', err)
        })
    ]
})