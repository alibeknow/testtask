import {
    BadRequestException,
    Body,
    Controller,
    Logger,
    Post,
    Res
} from '@nestjs/common'
import {MessagePattern, RpcException} from '@nestjs/microservices'
import {catchError, from, Observable, switchMap} from 'rxjs'

import {SiweService} from '../../../siwe/siwe.service'
import {AuthService} from '../../auth.service'
import {QUEUE_NAME} from '@lib/shared/constants'

@Controller('auth')
export class SignInController {
    private readonly logger = new Logger(SignInController.name)

    constructor(
        private readonly authService: AuthService,
        private readonly siweService: SiweService
    ) {}

    @Post('/signin')
    @MessagePattern({role: 'user', cmd: QUEUE_NAME.AUTH_GENERATE_TOKEN})
    signIn(@Body() signIn: any, @Res() response: any): Observable<any> {
        return from(this.siweService.consumeSignature(signIn)).pipe(
            catchError((error) => {
                throw new BadRequestException(error.message)
            }),
            switchMap(() => from(this.authService.signin(signIn, response))),
            catchError((error) => {
                throw new RpcException(new BadRequestException(error.message))
            })
        )
    }

    @MessagePattern({role: 'user', cmd: QUEUE_NAME.AUTH_REFRESH_TOKEN})
    refresh(@Body() refreshParams: any, @Res() response: any): Observable<any> {
        if (!refreshParams.refreshToken || refreshParams.refreshToken == '')
            throw new RpcException(
                new BadRequestException('Refresh token is required')
            )
        return from(
            this.authService.refresh(refreshParams.refreshToken, response)
        ).pipe(
            catchError((error) => {
                throw new RpcException(new BadRequestException(error.message))
            })
        )
    }
}
