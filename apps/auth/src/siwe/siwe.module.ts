import {ClientsModule, Transport} from '@nestjs/microservices'
import {SiweController} from './siwe.controller'
import {SiweService} from './siwe.service'
import {Module} from '@nestjs/common'
import {SIWE_SERVICE_NAME} from '@lib/shared'
import {config} from '../config'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: SIWE_SERVICE_NAME,
                useFactory: () => ({
                    transport: Transport.TCP,
                    options: {
                        host: config.auth.siwe.host,
                        port: config.auth.siwe.port
                    }
                })
            }
        ])
    ],
    controllers: [SiweController],
    providers: [SiweService],
    exports: [SiweService]
})
export class SiweModule {}
