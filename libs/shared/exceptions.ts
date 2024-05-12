import {BadRequestException, HttpException, HttpStatus} from '@nestjs/common'
import {throwError} from 'rxjs'
import {RpcException} from '@nestjs/microservices'

export function throwRxError(e: any) {
    switch (e?.status) {
        case 400:
            return throwError(
                () => new HttpException(e.message, HttpStatus.BAD_REQUEST)
            )
        default:
            return throwError(
                () =>
                    new HttpException(
                        e.message,
                        HttpStatus.INTERNAL_SERVER_ERROR
                    )
            )
    }
}

export function sendRPCError(e: any) {
    switch (e?.status) {
        case 400:
            return throwError(
                () => new RpcException(new BadRequestException(e.message))
            )
        default:
            return throwError(
                () => new RpcException(new BadRequestException(e.message))
            )
    }
}
