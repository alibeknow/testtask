import {Inject, Injectable} from '@nestjs/common'

import {ClientProxy} from '@nestjs/microservices'
import {Observable} from 'rxjs'
import {Response} from 'express'
import {AUTH_SERVICE_NAME, UserDto} from '@lib/shared'
import {QUEUE_NAME} from '@lib/shared/constants'

@Injectable()
export class AuthService {
    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientProxy

    public getProfile(userId: string): Observable<any> {
        const pattern = {cmd: QUEUE_NAME.PROFILE_GET, role: 'user'}
        const payload = {id: userId}
        return this.client.send(pattern, payload)
    }

    public refresh(refreshToken: string): Observable<any> {
        const pattern = {cmd: QUEUE_NAME.AUTH_REFRESH_TOKEN, role: 'user'}
        const payload = {refreshToken}
        return this.client.send<{accessToken: string}>(pattern, payload)
    }
    public login(userDto: UserDto, response: Response): Observable<any> {
        const pattern = {cmd: QUEUE_NAME.AUTH_GENERATE_TOKEN, role: 'user'}
        return this.client.send<{accessToken: string; refreshToken: string}>(
            pattern,
            userDto
        )
    }

    public signUp(userDto: UserDto): Observable<any> {
        const pattern = {cmd: QUEUE_NAME.USER_CREATE, role: 'user'}
        return this.client.send(pattern, userDto)
    }
}
