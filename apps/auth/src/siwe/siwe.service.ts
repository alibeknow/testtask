import {Inject, Injectable} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {catchError, Observable} from 'rxjs'
import {SIWE_SERVICE_NAME, VerifySignatureDto, sendRPCError} from '@lib/shared'
import {QUEUE_NAME} from '@lib/shared/constants'

@Injectable()
export class SiweService {
    @Inject(SIWE_SERVICE_NAME)
    private readonly client: ClientProxy

    public verifySignature(
        verifySignatureDto: VerifySignatureDto
    ): Observable<any> {
        const pattern = {cmd: QUEUE_NAME.SIWE_CHECK, role: 'user'}
        return this.client
            .send(pattern, verifySignatureDto)
            .pipe(catchError(sendRPCError))
    }

    public consumeSignature(
        verifySignatureDto: VerifySignatureDto
    ): Observable<any> {
        const pattern = {cmd: QUEUE_NAME.SIWE_READ, role: 'user'}
        return this.client
            .send(pattern, verifySignatureDto)
            .pipe(catchError(sendRPCError))
    }
}
