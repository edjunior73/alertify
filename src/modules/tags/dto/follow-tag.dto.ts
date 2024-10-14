import { ApiProperty } from '@nestjs/swagger'
import { IsAlphanumeric, IsString } from 'class-validator'

export class FollowTagDto {
  @ApiProperty()
  @IsAlphanumeric(undefined, { message: 'Tag must contain only letters or numbers' })
  @IsString()
  tag: string
}
