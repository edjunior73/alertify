import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { User } from '../user.model'

export class UserLogin {
  @ApiProperty()
  token: string

  @ApiProperty({ type: User })
  @Type(() => User)
  user: User
}
