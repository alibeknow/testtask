import {Module} from '@nestjs/common'
import {SiweService} from './siwe.service'
import {ConfigModule} from '@nestjs/config'
import {SIWEController} from './siwe.controller'
import {CacheService} from './cache.service'
import {CacheModule} from '@nestjs/cache-manager'
import {config} from '../config'

@Module({
    imports: [
        ConfigModule.forRoot(),
        CacheModule.register({
            max: config.siwe.cache.max_counts,
            ttl: config.siwe.cache.ttl * 1000
        })
    ],
    controllers: [SIWEController],
    providers: [SiweService, CacheService],
    exports: [SiweService]
})
export class SiweModule {}
