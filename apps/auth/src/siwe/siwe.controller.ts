import {Controller, Post} from '@nestjs/common'
import {SiweService} from './siwe.service'
import {Observable} from 'rxjs'
import {VerifySignatureDto} from '@lib/shared'

@Controller('/siwe')
export class SiweController {
    constructor(private readonly siweService: SiweService) {}

    @Post('/verify')
    verifyNonce(verifySignatureDto: VerifySignatureDto): Observable<any> {
        return this.siweService.verifySignature(verifySignatureDto)
    }

    @Post('/consume')
    consumeNonce(verifySignatureDto: VerifySignatureDto): Observable<any> {
        return this.siweService.consumeSignature(verifySignatureDto)
    }
}
