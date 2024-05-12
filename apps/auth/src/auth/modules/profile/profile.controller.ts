import {Body, Controller, Get} from '@nestjs/common'
import {MessagePattern} from '@nestjs/microservices'
import {User} from '../../entities/user.entity'
import {AuthService} from '../../auth.service'
import {QUEUE_NAME} from '@lib/shared/constants'

@Controller('profile')
export class ProfileController {
    constructor(private readonly authService: AuthService) {}

    @Get('/me')
    @MessagePattern({role: 'user', cmd: QUEUE_NAME.PROFILE_GET})
    me(@Body() user: User): Promise<User> {
        return this.authService.findOne(user.id)
    }
}
