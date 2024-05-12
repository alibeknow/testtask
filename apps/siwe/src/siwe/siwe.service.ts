import {BadRequestException, Injectable, Logger} from '@nestjs/common'
import {CacheService} from './cache.service'
import {Observable, from} from 'rxjs'
import {RpcException} from '@nestjs/microservices'
import {SiweMessage} from 'siwe'
import {VerifySignatureDto} from '@lib/shared'

@Injectable()
export class SiweService {
    private readonly logger = new Logger(SiweService.name)

    constructor(private readonly cacheService: CacheService) {}

    private processSignature(
        signatureDto: VerifySignatureDto,
        isDestroy = true
    ): Observable<any> {
        return from(
            (async () => {
                if (!signatureDto.message || !signatureDto.signature) {
                    throw new RpcException(
                        new BadRequestException(
                            'Message or signature not found'
                        )
                    )
                }

                const message = new SiweMessage(signatureDto.message)
                const nonce = message.nonce

                if (!this.cacheService.isPersist(nonce)) {
                    this.logger.debug(`Nonce has expired: ${nonce} `)
                    throw new RpcException(
                        new BadRequestException(
                            'Nonce has expired. Please request a new nonce'
                        )
                    )
                }

                if (
                    signatureDto?.address?.toLowerCase() !==
                    message.address?.toLowerCase()
                ) {
                    throw new RpcException(
                        new BadRequestException(
                            `Address does not match: ${signatureDto.address} !== ${message.address}`
                        )
                    )
                }

                if (isDestroy && signatureDto.destroy) {
                    this.logger.debug(`Removing nonce: ${nonce}`)
                    this.cacheService.delete(nonce)
                }

                const signature = signatureDto.signature.toString()

                try {
                    const verifyResult = await message.verify({signature})
                    await this.cacheService.delete(nonce)
                    return {success: verifyResult.success}
                } catch (e) {
                    throw new RpcException(e)
                }
            })()
        )
    }
    readSignature(verifySignatureDto: VerifySignatureDto): Observable<any> {
        return from(this.processSignature(verifySignatureDto))
    }

    checkSignature(verifySignatureDto: VerifySignatureDto): Observable<any> {
        return from(this.processSignature(verifySignatureDto, false))
    }
}
