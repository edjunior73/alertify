import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GeneralApiResponse } from '@common/decorators'
import { LoginDto } from '../dto'
import { UserLogin } from '../models'
import { UserService } from '../user.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @GeneralApiResponse({ data: UserLogin, summary: 'Login as a user', requiresAuth: false })
  login(@Body() input: LoginDto) {
    return this.userService.login(input)
  }
}
