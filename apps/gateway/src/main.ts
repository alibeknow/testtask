import {NestApplication, NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {Logger} from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import {config} from './config'

async function bootstrap() {
    const logger = new Logger('bootstrap')
    logger.log('Starting gateway server...')
    const app: NestApplication = await NestFactory.create(AppModule)
    app.use(helmet())
    app.use(cookieParser())
    const port = config.gateway.http.port

    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    })

    await app.listen(port)
    logger.log(`Gateway Server running on http://localhost:${port}`)
}

bootstrap()
