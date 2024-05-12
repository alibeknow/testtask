import {Module} from '@nestjs/common'
import {ClientsModule, Transport} from '@nestjs/microservices'
import {SIWEController} from './siwe.controller'
import {SiweService} from './siwe.service'
import {SIWE_SERVICE_NAME} from '@lib/shared'
import {config} from '../../config'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: SIWE_SERVICE_NAME,
                useFactory: () => ({
                    transport: Transport.TCP,
                    options: {
                        host: config.gateway.siwe.host,
                        port: config.gateway.siwe.port
                    }
                })
            }
        ])
    ],
    controllers: [SIWEController],
    providers: [SiweService],
    exports: [SiweService]
})
export class SiweModule {}
