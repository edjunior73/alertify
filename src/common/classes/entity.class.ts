import { Prop } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { generateId } from '@common/utils'

export class Entity {
  @Prop({ default: generateId })
  @ApiProperty()
  _id: string

  @ApiProperty()
  id: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
