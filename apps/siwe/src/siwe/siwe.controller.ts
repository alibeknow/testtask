import {Body, Controller, Get, Logger, Post, Req} from '@nestjs/common'
import {MessagePattern} from '@nestjs/microservices'
import {catchError, Observable} from 'rxjs'
import {generateNonce} from 'siwe'
import {SiweService} from './siwe.service'
import {CacheService} from './cache.service'
import {VerifySignatureDto, sendRPCError, throwRxError} from '@lib/shared'
import {QUEUE_NAME} from '@lib/shared/constants'

@Controller('/siwe')
export class SIWEController {
    private readonly logger = new Logger(SIWEController.name)

    constructor(
        private readonly siweService: SiweService,
        private readonly cacheService: CacheService
    ) {}

    @Get('/nonce')
    @MessagePattern({role: 'user', cmd: QUEUE_NAME.SIWE_GET_NONCE})
    async getNonce(@Req() req: Request): Promise<{nonce: string}> {
        this.logger.debug(`GET /siwe/nonce - Nonce request`)
        const nonce = generateNonce()
        await this.cacheService.add(nonce)
        this.logger.debug(`ADDED NONCE ${nonce}`)
        return {nonce}
    }

    @MessagePattern({role: 'user', cmd: QUEUE_NAME.SIWE_READ})
    consumeSiwe(
        @Body() verifySignatureDto: VerifySignatureDto
    ): Observable<any> {
        this.logger.debug(`POST FROM GATEWAY - READ message / nonce`)
        return this.siweService
            .readSignature({...verifySignatureDto, destroy: true})
            .pipe(catchError(sendRPCError))
    }

    @Post('/check')
    @MessagePattern({role: 'user', cmd: QUEUE_NAME.SIWE_CHECK})
    verifyNonce(
        @Body() verifySignatureDto: VerifySignatureDto
    ): Observable<any> {
        this.logger.debug(
            `POST FROM GATEWAY /siwe/check - Checking message / nonce`,
            verifySignatureDto
        )
        return this.siweService
            .checkSignature(verifySignatureDto)
            .pipe(catchError(throwRxError))
    }
}
