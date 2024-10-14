import { ApiProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { Exclude } from 'class-transformer'
import { Entity } from '@common/classes'
import { CustomSchema } from '@common/decorators/custom-schema.decorator'

@CustomSchema()
export class User extends Entity {
  @ApiProperty()
  @Prop({ required: true })
  name: string

  @ApiProperty()
  @Prop({ unique: true, required: true })
  email: string

  @Prop({ required: true })
  @Exclude()
  password: string
}
