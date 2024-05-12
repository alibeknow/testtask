import {Body, Controller, Post} from '@nestjs/common'
import {MessagePattern} from '@nestjs/microservices'
import {AuthService} from '../../auth.service'
import {QUEUE_NAME} from '@lib/shared/constants'

@Controller('user')
export class SignUpController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signin')
    @MessagePattern({role: 'user', cmd: QUEUE_NAME.USER_CREATE})
    async signUp(@Body() signUp: any): Promise<any> {
        return this.authService.signup(signUp)
    }
}
