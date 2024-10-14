import { HttpStatus } from '@nestjs/common'
import { DomainError } from './domain.error'

export class UnauthenticatedError extends DomainError<'unauthenticated'> {
  constructor() {
    super({
      code: 'unauthenticated',
      message: 'You need to be authenticated to perform this action',
      status: HttpStatus.UNAUTHORIZED
    })
  }
}
