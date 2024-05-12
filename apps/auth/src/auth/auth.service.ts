import {BadRequestException, Injectable, Logger} from '@nestjs/common'
import {RpcException} from '@nestjs/microservices'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository, SaveOptions} from 'typeorm'
import {User} from './entities/user.entity'
import {Users} from './models/users.model'
import {JwtService} from '@nestjs/jwt'
import {catchError, from, map, Observable} from 'rxjs'
import {ROLE} from '@lib/shared/constants'

interface SigninProps {
    username: string
    address: string
    signature: string
    message: string
}

interface SignupProps extends Users {
    username: string
    address: string
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)

    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService
    ) {}

    async validateUser(
        username: string,
        address: string
    ): Promise<User | null> {
        console.log(await this.userRepository.find())
        return this.userRepository.findOne({
            select: ['id', 'username', 'address', 'role'],
            where: {username, address: address.toLowerCase()}
        })
    }

    signin(props: SigninProps, response: any): Observable<any> {
        return from(this.validateUser(props.username, props.address)).pipe(
            map((user) => {
                if (!user) {
                    throw new BadRequestException('User not found')
                }

                const payload = {
                    sub: user.id,
                    role: user.role,
                    username: user.username,
                    address: user.address
                }

                const accessToken = this.jwtService.sign(payload, {
                    expiresIn: '5s'
                })
                const refreshToken = this.jwtService.sign(payload, {
                    expiresIn: '7d'
                })

                // We might not have response (e.g. when called from microservice)
                if (response) {
                    response
                        .cookie('refresh_token', refreshToken, {
                            httpOnly: true,
                            sameSite: 'strict',
                            // secure: process.env.NODE_ENV !== 'development',
                            path: '/',
                            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                        })
                        .json({success: true})

                    return response.send({success: true, accessToken})
                }
                return {success: true, accessToken, refreshToken}
            }),
            catchError((error) => {
                this.logger.error('Error in signin service', error)
                throw new RpcException(new BadRequestException(error.message))
            })
        )
    }

    refresh(refreshToken: string, response: any): Observable<any> {
        return from(this.jwtService.verifyAsync(refreshToken)).pipe(
            map((verify) => {
                if (!verify)
                    throw new RpcException(
                        new BadRequestException('Invalid refresh token')
                    )

                const payload = {
                    sub: verify.sub,
                    role: verify.role,
                    username: verify.username,
                    address: verify.address
                }

                const accessToken = this.jwtService.sign(payload, {
                    expiresIn: '10m'
                })

                if (response) {
                    return response.send({success: true, accessToken})
                }

                return {success: true, accessToken}
            }),
            catchError((error) => {
                throw new BadRequestException(error.message)
            })
        )
    }
    async signup(
        props: SignupProps,
        options?: SaveOptions
    ): Promise<{user: User; accessToken: string; refreshToken: string}> {
        const userProps = {
            username: '',
            address: '',
            role: ROLE.USER,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        if (props?.username) userProps.username = props.username
        if (props?.address) userProps.address = props.address

        try {
            const user = await this.userRepository.save(userProps, options)
            const payload = {
                sub: user.id,
                role: user.role,
                username: user.username,
                address: user.address
            }
            const accessToken = this.jwtService.sign(payload, {
                expiresIn: '5s'
            })
            const refreshToken = this.jwtService.sign(payload, {
                expiresIn: '7d'
            })
            return {accessToken, refreshToken, user}
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new RpcException(
                    new BadRequestException('User or address already exists')
                )
            }
            console.log(e)
            throw new RpcException(e)
        }
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find()
    }

    async findOne(id: number): Promise<User | undefined> {
        return await this.userRepository.findOne({
            select: ['id', 'username', 'address', 'role'],
            where: {id}
        })
    }

    async remove(id: string) {
        await this.userRepository.delete(id)
    }
}
