import {
    Get,
    HttpException,
    HttpStatus,
    Body,
    Controller,
    Logger,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common'
import {
    catchError,
    firstValueFrom,
    throwError,
    Observable,
    lastValueFrom,
    map,
    from
} from 'rxjs'

import {AuthService} from './auth.service'
import {ProfileDto, UserDto, throwRxError} from '@lib/shared'
import {JWTAuthGuard} from '@lib/shared/jwt.guard'
import {Cookies} from '@lib/shared/decorators/cookie.decorator'
import {config} from '../../config'

@Controller('/user')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(private readonly authService: AuthService) {}

    @UseGuards(new JWTAuthGuard(config.gateway.jwt.secret))
    @Get('/profile')
    getProfile(@Body() body: ProfileDto, @Req() req: any): Observable<any> {
        const userId = req.user['sub']
        if (!userId) {
            return throwError(
                () => new HttpException('User not found', HttpStatus.NOT_FOUND)
            )
        }
        this.logger.debug(`GET /user/profile - Profile request from ${userId}`)
        return this.authService
            .getProfile(userId)
            .pipe(catchError(throwRxError))
    }

    @Get('/refresh')
    refresh(
        @Req() req: any,
        @Cookies('refresh_token') cookies: any
    ): Observable<any> {
        const refreshToken = req.cookies['refresh_token']
        this.logger.debug(
            `GET /user/refresh - Refresh request from ${refreshToken}`
        )

        if (!refreshToken || refreshToken === '') {
            return throwError(
                () =>
                    new HttpException(
                        'Refresh token is required',
                        HttpStatus.BAD_REQUEST
                    )
            )
        }

        const serviceResponse = this.authService
            .refresh(refreshToken)
            .pipe(catchError((error) => throwError(() => error)))

        return from(lastValueFrom(serviceResponse)).pipe(
            map((result) => ({success: true, accessToken: result.accessToken})),
            catchError((error) => throwError(() => error))
        )
    }
    @Post('/signin')
    async login(
        @Body() userDto: UserDto,
        @Res() response: any,
        @Cookies('refresh_token') cookies: string
    ): Promise<Observable<any>> {
        return new Observable<any>((observer) => {
            this.logger.debug(
                `POST /user/signin - signin request from ${userDto.username}`
            )

            const handlelogin = async () => {
                try {
                    const serviceResponse = await firstValueFrom(
                        this.authService
                            .login(userDto, response)
                            .pipe(catchError(throwRxError))
                    )
                    if (!serviceResponse.success) {
                        throw new HttpException(
                            serviceResponse.error,
                            HttpStatus.BAD_REQUEST
                        )
                    }

                    response.cookie(
                        'refresh_token',
                        serviceResponse.refreshToken,
                        {
                            httpOnly: false,
                            secure: false,
                            sameSite: 'lax'
                        }
                    )

                    response.send({
                        success: true,
                        accessToken: serviceResponse.accessToken
                    })
                    observer.next({success: true})
                    observer.complete()
                } catch (error) {
                    observer.error(error)
                }
            }

            handlelogin()
        })
    }

    @Post('/signup')
    signup(@Body() userDto: UserDto): Observable<any> {
        this.logger.debug(
            `POST /user/signup - Sign-up request from ${userDto.username}`
        )
        return this.authService.signUp(userDto).pipe(catchError(throwRxError))
    }
}
