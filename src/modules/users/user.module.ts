import { Global, Module, Provider } from '@nestjs/common'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'
import { UserController } from './user.controller'
import { UseCasesList } from './use-cases'
import { AuthService } from './services'
import { AuthController } from './controllers'

const exposedProviders: Provider[] = [AuthService, UserService, UserRepository]

@Global()
@Module({
  providers: [...UseCasesList, ...exposedProviders],
  controllers: [UserController, AuthController],
  exports: [...exposedProviders]
})
export class UserModule {}
