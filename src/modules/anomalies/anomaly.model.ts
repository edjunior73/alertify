import { ApiProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { Entity } from '@common/classes'
import { CustomSchema } from '@common/decorators'
import { Platform } from '@common/enums'

@CustomSchema()
export class AnomalyRule {
  @ApiProperty()
  @Prop({ index: true, required: true })
  comparatorNumber: number

  @ApiProperty()
  @Prop({ index: true, required: true })
  timeWindow: number
}

@CustomSchema()
export class Anomaly extends Entity {
  @ApiProperty({ enum: Platform, enumName: 'Platform' })
  @Prop({ required: true, enum: Platform })
  anomalyRule: AnomalyRule

  @ApiProperty()
  @Prop({ index: true, required: true })
  tag: string

  @ApiProperty({ type: Date })
  @Prop({ required: true })
  ocurredAt: Date
}
