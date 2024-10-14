import { HttpStatus } from '@nestjs/common'
import { TokenStatus } from '@common/types'
import { DomainError } from './domain.error'

interface InvalidTokenErrorMetadata {
  status: Exclude<TokenStatus, 'valid'>
}

export class InvalidTokenError extends DomainError<'invalid_token', InvalidTokenErrorMetadata> {
  constructor(readonly metadata: InvalidTokenErrorMetadata) {
    super({
      code: 'invalid_token',
      message: 'The provided token is invalid',
      status: HttpStatus.UNAUTHORIZED
    })
  }
}
