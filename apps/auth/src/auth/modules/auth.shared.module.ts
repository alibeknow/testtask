import {JwtModule, JwtModuleOptions} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import {TypeOrmModule} from '@nestjs/typeorm'
import {Users} from '../models/users.model'
import {AuthService} from '../auth.service'
import {Module} from '@nestjs/common'
import {config} from '../../config'
import {ConfigModule, ConfigService} from '@nestjs/config'

const signOptions = {
    expiresIn: '60m'
}

@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([Users]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (): Promise<JwtModuleOptions> => ({
                secret: config.auth.jwt.secret,
                signOptions
            })
        })
    ],
    providers: [AuthService],
    exports: [AuthService, PassportModule, JwtModule, TypeOrmModule]
})
export class AuthSharedModule {}
