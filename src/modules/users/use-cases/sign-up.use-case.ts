import { Injectable } from '@nestjs/common'
import { ObjectAlreadyExistsError } from '@common/errors'
import { UseCase } from '@common/classes/use-case.class'
import { CryptService } from '@modules/global-configs'
import { UserLogin } from '@modules/users/models'
import { UserRepository } from '@modules/users/user.repository'
import { AuthService } from '@modules/users/services/auth.service'
import { SignUpDto } from '@modules/users/dto'

export type SignUpArgs = SignUpDto

@Injectable()
export class SignUpUseCase extends UseCase<SignUpArgs, UserLogin> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptService: CryptService,
    private readonly authService: AuthService
  ) {
    super()
  }

  async execute(input: SignUpArgs): Promise<UserLogin> {
    const existsUser = await this.userRepository.existsByEmail(input.email)

    if (existsUser) {
      throw new ObjectAlreadyExistsError({
        field: 'email',
        objectType: 'User'
      })
    }

    const hashedPassword = await this.cryptService.encrypt(input.password)

    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword
    })

    return this.authService.getUserLoginPayload(user)
  }
}
