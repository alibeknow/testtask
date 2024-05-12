import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'

import * as jwt from 'jsonwebtoken'

@Injectable()
export class JWTAuthGuard implements CanActivate {
    jwtsecret: string
    constructor(jwtSecret: string) {
        this.jwtsecret = jwtSecret
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!this.jwtsecret) {
            throw new Error('JWT secret is missing in the configuration')
        }

        const req = context.switchToHttp().getRequest()
        const bearerHeader = req.headers['authorization']
        if (!bearerHeader) {
            throw new UnauthorizedException('Unauthorized request')
        }

        const token = bearerHeader.split(' ')[1]
        try {
            req.user = jwt.verify(token, this.jwtsecret)
        } catch (e) {
            throw new UnauthorizedException('Invalid token')
        }

        return true
    }
}
