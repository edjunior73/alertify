import { HttpStatus } from '@nestjs/common'
import { DomainError } from './domain.error'

export class ForbiddenError extends DomainError<'forbidden'> {
  constructor(readonly subCode?: string) {
    super({
      code: 'forbidden',
      message: 'You are not authorized to perform this action',
      status: HttpStatus.FORBIDDEN
    })
  }
}
