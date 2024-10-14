import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GeneralApiResponse } from '@common/decorators'
import { UserService } from './user.service'
import { UserLogin } from './models'
import { SignUpDto } from './dto'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @GeneralApiResponse({
    data: UserLogin,
    summary: 'Sign up as a new user',
    requiresAuth: false,
    defaultStatus: HttpStatus.CREATED
  })
  signUp(@Body() input: SignUpDto) {
    return this.userService.signUp(input)
  }
}
