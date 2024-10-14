import { Injectable } from '@nestjs/common'
import { SignUpUseCase } from './use-cases/sign-up.use-case'
import { LoginDto, SignUpDto } from './dto'
import { LoginUseCase } from './use-cases/login.use-case'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly userRepository: UserRepository
  ) {}

  signUp(input: SignUpDto) {
    return this.signUpUseCase.execute(input)
  }

  login(input: LoginDto) {
    return this.loginUseCase.execute(input)
  }

  existsUserById(id: string) {
    return this.userRepository.existsById(id)
  }
}
