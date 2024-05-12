import {NestApplication, NestFactory} from '@nestjs/core'
import {Transport} from '@nestjs/microservices'
import {Logger} from '@nestjs/common'

import {AppModule} from './app.module'
import helmet from 'helmet'
import {config} from './config'

async function bootstrap() {
    const logger = new Logger('bootstrap')
    logger.log('Starting Auth Service...')

    const app: NestApplication = await NestFactory.create(AppModule)
    app.use(helmet())
    try {
        const enableREST = config.auth.http.enable
        if (enableREST) {
            const restPort = config.auth.http.port

            await app.listen(restPort)
            logger.log(`Auth HTTP Service running on ${restPort} port`)
        }
        const enableTCP = config.auth.tcp.enable
        if (enableTCP) {
            const servicePort = config.auth.tcp.port

            app.connectMicroservice({
                transport: Transport.TCP,
                options: {
                    port: servicePort
                }
            })
            await app.startAllMicroservices()
            logger.log(`Auth TCP Service running on ${servicePort} port`)
        }
    } catch (e) {
        logger.error(`Failed to start server: ${e}`)
        process.exit(1)
    }
}

bootstrap()
