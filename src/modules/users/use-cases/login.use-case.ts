import { Injectable } from '@nestjs/common'
import { AuthInvalidError } from '@common/errors'
import { IUseCase } from '@common/types'
import { CryptService } from '@modules/global-configs'
import { LoginDto } from '@modules/users/dto'
import { UserLogin } from '@modules/users/models'
import { UserRepository } from '@modules/users/user.repository'
import { AuthService } from '@modules/users/services/auth.service'

export type LoginParams = LoginDto

@Injectable()
export class LoginUseCase implements IUseCase<LoginParams, UserLogin> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
    private readonly authService: AuthService
  ) {}

  async execute({ email, password }: LoginParams): Promise<UserLogin> {
    const foundUser = await this.userRepository.getByEmail(email)

    if (!foundUser) {
      throw new AuthInvalidError({ field: 'email' })
    }

    const isPasswordCorrect = await this.cryptService.compare(password, foundUser.password)

    if (!isPasswordCorrect) {
      throw new AuthInvalidError({ field: 'password' })
    }

    return this.authService.getUserLoginPayload(foundUser)
  }
}
