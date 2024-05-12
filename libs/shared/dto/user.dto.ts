import {ApiProperty} from '@nestjs/swagger'
import {IsString, MaxLength} from 'class-validator'

export class UserDto {
    @ApiProperty({
        description: 'ENS',
        example: 'vitalik.eth',
        required: true,
        type: 'string'
    })
    @IsString()
    readonly username: string

    @ApiProperty({
        description: 'user wallet address',
        example: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        required: true,
        type: 'string'
    })
    @IsString()
    @MaxLength(42)
    readonly address: string
}
