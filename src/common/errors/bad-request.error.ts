import { HttpStatus } from '@nestjs/common'
import { DomainError } from './domain.error'

export class BadRequestError extends DomainError<'bad_request'> {
  constructor(readonly subCode?: string) {
    super({
      code: 'bad_request',
      message: 'Request is invalid',
      status: HttpStatus.BAD_REQUEST
    })
  }
}
