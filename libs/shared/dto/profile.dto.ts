import {IsString, MaxLength} from 'class-validator'
export class ProfileDto {
    @IsString()
    readonly id: string
    @IsString()
    readonly username: string
    @IsString()
    @MaxLength(42)
    readonly address: string
    @IsString()
    readonly role: string
}
