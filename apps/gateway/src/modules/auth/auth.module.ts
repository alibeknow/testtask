import {Module} from '@nestjs/common'
import {ClientsModule, Transport} from '@nestjs/microservices'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {AUTH_SERVICE_NAME} from '@lib/shared'
import {config} from '../../config'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE_NAME,
                useFactory: () => ({
                    transport: Transport.TCP,
                    options: {
                        host: config.gateway.auth.host,
                        port: config.gateway.auth.port
                    }
                })
            }
        ])
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
