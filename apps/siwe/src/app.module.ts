import {Module} from '@nestjs/common'
import {SiweModule} from './siwe/siwe.module'

@Module({
    imports: [SiweModule]
})
export class AppModule {}
