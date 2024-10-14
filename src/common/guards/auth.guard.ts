import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { InvalidTokenError, UnauthenticatedError } from '@common/errors'
import { UserService } from '@modules/users/user.service'
import { Request } from '../types'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const { tokenStatus, user } = context.switchToHttp().getRequest<Request>()

    if (tokenStatus === 'missing') throw new UnauthenticatedError()

    if (tokenStatus && tokenStatus !== 'valid') {
      throw new InvalidTokenError({
        status: tokenStatus
      })
    }

    if (!user) throw new UnauthenticatedError()

    const userExists = await this.userService.existsUserById(user.id)

    if (!userExists) throw new UnauthenticatedError()

    return userExists
  }
}
