import { ApiProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { Exclude } from 'class-transformer'
import { Entity } from '@common/classes'
import { CustomSchema } from '@common/decorators'

@CustomSchema()
export class Tag extends Entity {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  tag: string

  @Prop({ index: true, required: true, type: [String] })
  @Exclude()
  userIds: string[]
}
