import {ApiProperty} from '@nestjs/swagger'
import {IsBoolean, IsOptional, IsString, MaxLength} from 'class-validator'

export class VerifySignatureDto {
    @ApiProperty()
    @IsString()
    public readonly signature: string

    @ApiProperty()
    @IsString()
    public readonly message: string

    @ApiProperty()
    @IsString()
    @MaxLength(42)
    public readonly address: string

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    public readonly destroy?: boolean
}
