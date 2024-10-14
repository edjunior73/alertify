import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignUpDto {
  @ApiProperty()
  @MinLength(3)
  @IsString()
  name: string

  @ApiProperty()
  @IsEmail()
  @IsString()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string
}
