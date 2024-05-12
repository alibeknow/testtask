import {Inject, Injectable} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {SiweMessage} from 'siwe'
import {Observable} from 'rxjs'
import {SIWE_SERVICE_NAME, VerifySignatureDto} from '@lib/shared'
import {QUEUE_NAME} from '@lib/shared/constants'

@Injectable()
export class SiweService {
    @Inject(SIWE_SERVICE_NAME)
    private readonly client: ClientProxy

    public requestNonce(): Observable<{
        message: SiweMessage
        nonce: string
    }> {
        const pattern = {cmd: QUEUE_NAME.SIWE_GET_NONCE, role: 'user'}
        return this.client.send(pattern, {})
    }

    public checkSignature(verifySignatureDto: VerifySignatureDto): Observable<{
        success: boolean
        message: SiweMessage
        nonce: string
    }> {
        const pattern = {cmd: QUEUE_NAME.SIWE_CHECK, role: 'user'}
        return this.client.send(pattern, verifySignatureDto)
    }
}
