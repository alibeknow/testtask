import {NestApplication, NestFactory} from '@nestjs/core'
import {Transport} from '@nestjs/microservices'
import {Logger} from '@nestjs/common'

import {AppModule} from './app.module'
import helmet from 'helmet'
import {config} from './config'

async function bootstrap() {
    const logger = new Logger('bootstrap')
    logger.log('Starting SIWE Service...')

    const app: NestApplication = await NestFactory.create(AppModule)
    app.use(helmet())
    try {
        const enableREST = config.siwe.http.enable
        if (enableREST) {
            const restPort = config.siwe.http.port

            await app.listen(restPort)
            logger.log(`SIWE HTTP Service running on port ${restPort}`)
        }
        const enableTCP = config.siwe.tcp.enable
        if (enableTCP) {
            const servicePort = config.siwe.tcp.port

            app.connectMicroservice({
                transport: Transport.TCP,
                options: {
                    port: servicePort
                }
            })
            await app.startAllMicroservices()
            logger.log(`SIWE TCP Service running on port ${servicePort}`)
        }
    } catch (e) {
        logger.error(`Failed to start server: ${e}`)
        process.exit(1)
    }
}

bootstrap()
