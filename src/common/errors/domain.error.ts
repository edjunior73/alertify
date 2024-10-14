import { HttpStatus } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ErrorCode } from '@common/types'

export interface DomainErrorParams<Err extends ErrorCode> {
  message: string
  code: Err
  /**
   * @default HttpStatus.BAD_REQUEST
   */
  status?: HttpStatus
}

export class DomainError<
  Err extends ErrorCode,
  TMetadata extends Record<string, any> | undefined = undefined
> extends Error {
  @ApiPropertyOptional()
  readonly metadata?: TMetadata

  @ApiProperty()
  readonly name: string

  @ApiProperty()
  readonly code: Err

  @ApiProperty({ enum: HttpStatus, default: HttpStatus.BAD_REQUEST, enumName: 'HttpStatus' })
  readonly status: HttpStatus

  readonly subCode?: string

  constructor({ message, code, status = HttpStatus.BAD_REQUEST }: DomainErrorParams<Err>) {
    super(message)

    this.name = this.constructor.name
    this.code = code
    this.status = status
  }
}
