import { ApiProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { Entity } from '@common/classes'
import { CustomSchema } from '@common/decorators'
import { Platform } from '@common/enums'

@CustomSchema()
export class Post extends Entity {
  @ApiProperty()
  @Prop({ required: true })
  content: string

  @ApiProperty()
  @Prop({ required: true })
  authorUsername: string

  @ApiProperty({ enum: Platform, enumName: 'Platform' })
  @Prop({ required: true, enum: Platform })
  platform: Platform

  @ApiProperty()
  @Prop({ required: true })
  externalId: string

  @ApiProperty({ isArray: true })
  @Prop({ index: true, required: true, type: [String] })
  tags: string[]
}
