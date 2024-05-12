import {Body, Controller, Get, Logger, Post} from '@nestjs/common'
import {SiweService} from './siwe.service'
import {catchError, Observable} from 'rxjs'
import {SiweMessage} from 'siwe'
import {VerifySignatureDto, throwRxError} from '@lib/shared'

@Controller('/siwe')
export class SIWEController {
    private readonly logger = new Logger(SIWEController.name)

    constructor(private readonly siweService: SiweService) {}

    @Get('/nonce')
    getNonce(): Observable<{message: SiweMessage; nonce: string}> {
        this.logger.debug(`= GET /siwe/nonce - Nonce request`)
        return this.siweService.requestNonce().pipe(catchError(throwRxError))
    }

    @Post('/verify')
    verifyNonce(@Body() verifySignatureDto: VerifySignatureDto): Observable<{
        success: boolean
    }> {
        this.logger.debug(
            `= GET /siwe/verify - Verifying message ${JSON.stringify(
                verifySignatureDto
            )}`
        )

        return this.siweService
            .checkSignature(verifySignatureDto)
            .pipe(catchError(throwRxError))
    }
}
