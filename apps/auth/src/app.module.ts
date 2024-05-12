import {TypeOrmModule} from '@nestjs/typeorm'
import {Module} from '@nestjs/common'
import {AuthModule} from './auth/auth.module'
import {config} from './config'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                type: 'sqlite',
                database: config.auth.database.path,
                autoLoadEntities: true,
                synchronize: true
            })
        }),
        AuthModule
    ]
})
export class AppModule {}
